import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

const CDK_REGION = 'us-west-2';
const CDK_ENV = process.env.ENV || 'dev';
const CDK_TIMESCALE_AMI = process.env.TIMESCALE_AMI || 'ami-0beb1a82cbf80f965'; // us-west-2 AMI - https://github.com/timescale/docs.timescale.com-content/blob/master/getting-started/installation-ubuntu-ami.md
const CDK_KEY_PAIR = process.env.KEY_PAIR || 'cementys-dev';
const CDK_POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'cementys-dev-password';
const CDK_ALLOWED_IP = process.env.ALLOWED_IP ? JSON.parse(process.env.ALLOWED_IP) : [{
  ip: '89.3.1.231/32',
  description: 'pierre',
}];

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, `vpc-${CDK_ENV}`, {
      maxAzs: 3,
    });

    /**
     * WIP
     * Creating a bastion in public subnet
     */
    // const host = new ec2.BastionHostLinux(this, 'BastionHost', {
    //   vpc,
    //   subnetSelection: {
    //     subnetType: ec2.SubnetType.PUBLIC,
    //   }
    //  }); // https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ec2.BastionHostLinux.html
    //  host.allowSshAccessFrom(ec2.Peer.ipv4('89.3.1.231/32')); // https://github.com/aws/aws-cdk/blob/master/packages/@aws-cdk/aws-ec2/README.md#bastion-hosts
    //  // https://aws.amazon.com/de/blogs/compute/new-using-amazon-ec2-instance-connect-for-ssh-access-to-your-ec2-instances/


    /**
    * Creating the db machine with timescalse setup
    *
    * Connection to ec2: ssh ubuntu@ec2-<IP>.us-west-2.compute.amazonaws.com
    * Connection superuser to db: sudo -u postgres psql postgres
    * sudo service postgresql restart
    */
    // Security group - inbound/outbound rules
    const sgName = `SG-timescale-${CDK_ENV}`
    const timescaleSG = new ec2.SecurityGroup(this, sgName, {
      vpc,
      allowAllOutbound: true,
      securityGroupName: sgName,
    });

    for (let i = 0; i < CDK_ALLOWED_IP.length; i += 1) {
      timescaleSG.addIngressRule(ec2.Peer.ipv4(CDK_ALLOWED_IP[i].ip), ec2.Port.tcp(22), CDK_ALLOWED_IP[i].description);
      timescaleSG.addIngressRule(ec2.Peer.ipv4(CDK_ALLOWED_IP[i].ip), ec2.Port.tcp(5432), CDK_ALLOWED_IP[i].description);
    }

    // Instancce
    const machineName = `Timescale-${CDK_ENV}`;
    const timescaleAmi = ec2.MachineImage.genericLinux({ 'us-west-2': CDK_TIMESCALE_AMI }); // timescale AMI
    const timescale = new ec2.Instance(this, machineName, {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO), // EBS optimized instance
      machineImage: timescaleAmi,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC, // TODO Use private subnet for prod, once bastion is setup
      },
      securityGroup: timescaleSG,
      allowAllOutbound: true,
      keyName: CDK_KEY_PAIR,
      blockDevices: [{ // https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ec2.BlockDeviceVolume.html
        deviceName: '/dev/sda1', // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/device_naming.html
        volume: ec2.BlockDeviceVolume.ebs(15, {
          deleteOnTermination: true, // TODO should be false on prod env
          volumeType: ec2.EbsDeviceVolumeType.IO1, // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html
          iops: 100, // TODO define needs
          // volumeSize: ?,
          // snapshotId: ?,
        }),
      },
      ]
    });

    // User data - https://docs.aws.amazon.com/cdk/api/latest/docs/aws-ec2-readme.html#user-data
    // TODO upload a file with configuration on S3
    // TODO run all SQL from a file
    // https://memo-linux.com/debianubuntu-could-not-get-lock-varlibdpkglock-open-11-resource-temporarily-unavailable/
    timescale.userData.addCommands(`
      sudo apt-get update && \
      sudo apt-get install -y postgresql-11-postgis-2.5 postgresql-contrib-11 && \
      sudo -u postgres psql -c "CREATE USER thminsight WITH ENCRYPTED PASSWORD '${CDK_POSTGRES_PASSWORD}';" && \
      sudo -u postgres psql -c "CREATE DATABASE thminsight WITH OWNER thminsight;" && \
      sudo -u postgres psql -d thminsight -c "CREATE EXTENSION IF NOT EXISTS hstore; CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE EXTENSION IF NOT EXISTS postgis; CREATE EXTENSION IF NOT EXISTS timescaledb;" && \
      echo "hostssl thminsight      thminsight      0.0.0.0/0               md5" | sudo tee -a /etc/postgresql/11/main/pg_hba.conf && \
      echo "listen_addresses = '*'                  # what IP address(es) to listen on;" | sudo tee -a /etc/postgresql/11/main/postgresql.conf && \
      sudo service postgresql restart ${CDK_ENV === 'dev' && '&& sudo poweroff'}
    `);
  }
}
