INSERT INTO 
    companies(name,address,city,postcode,type)
VALUES
    ('Company-1', '9 RUE LEON BLUM', 'PALAISEAU', 91120,'MONITORING'),
    ('Company-2', '4 RUE DE PARIS', 'Massy', 91123,'TOPOGRAPHIE'),
    ('Company-3', '13 rue Charles de Gaulle', 'Paris', 75013,'BTP'),
    ('Company-4', '5 Place de clichy', 'Paris', 75017,'BTP');

INSERT INTO 
    users  (
    email,
    password,
    first_name,
    company_id) 
VALUES
    ('user-1-company@cementys.com','16fdfc9f3214d683bc4dc6a47c50550bb6ebe284cd118020455c2cfbc3d0bf32','user1',1), --password:toto / user1 belongs to company 1
    ('user-2-companies@cementys.com','f22ebd25bd26ece6c9c30841111a96a2af063531926d8ba511c7f3a0a08a2e63','user2',1), --password:pass / user2 belongs to the companies 3 & 4
    ('user-0-company@cementys.com','043d989ad0f63a6a3878c8fe5af111278f1a2ecc6e93fdcb090ba0f38942639a','user3',3), --password:sql / user3 doesn't belong to any company in companies' table
    ('khaledebdelli@cementys.com','043d989ad0f63a6a3878c8fe5af111278f1a2ecc6e93fdcb090ba0f38942639a','khaled',4); --password:sql / user3 doesn't belong to any company in companies' table

INSERT INTO projects (
    -- project_photo, 
    name, 
    -- country, 
    -- client_comapany_name,
    -- time_zone,city, 
    -- start_date,
    description
    ) 
VALUES
    ('FONTINETTES', 'Projet d''auscultation de l''ouvrage Fontinettes'),
    ('FONTINETTES 2', 'Projet d''auscultation de l''ouvrage Fontinettes 2');

INSERT INTO 
    projects_companies 
VALUES
    (1,1,'client'),
    (2,1,'client'),
    (1,4,'supplier'),
    (2,4,'supplier');

INSERT INTO 
    media(type,name,description,url,project_id) 
VALUES
    ('image/jpeg', 'Fontinettes', 'Vue d''ensemble du projet fontinettes', '/images/project/fontinettes/p1.png',1),
    ('image/jpeg', 'Fontinettes','Présentation du projet L14', '/images/project/fontinettes/p2.jpg',1),
    ('image/jpeg', 'Fontinettes', 'Vue d''ensemble du projet fontinettes', '/images/project/fontinettes/p3.jpg',1),
    ('image/jpeg', 'Fontinettes 2', 'Vue densemble du projet fontinettes 2', '/images/project/fontinettes/Image 7.png',2),
    ('image/jpeg', 'Fontinettes 2', 'Vue densemble du projet fontinettes 2', '/images/project/fontinettes/Image 11.png',2);

INSERT INTO 
    sites (name, project_id) 
VALUES 
    ('FNT P1 1', 1),
    ('FNT P1 2', 1),
    ('FNT P2 1', 2),
    ('FNT P2 2', 2);

INSERT INTO 
    gateways (file_name,gateway_name,Serial_Number,X,Y,Z) 
values
    ('testbox11','boxe11','123ABC',1650233,8392540,100),
    ('testbox12','boxe12','123ABC',1650233,8392540,100),
    ('testbox21','boxe21','ABC123',1650233,8392540,100),
    ('testbox22','boxe22','ABC123',1650233,8392540,100);

INSERT INTO 
    site_gateway(site_id,gateway_id) 
values
    (1,1),
    (2,2),
    (3,3),
    (4,4);

INSERT INTO 
    config (file_name, last_treatment, config,gateway_id, ftp_ip ,ftp_directory)
VALUES
    ('CR216X_Fontinettes_VNF_Fontinettes.dat',
    '1995-01-01 10:23:54',
    '[ { "alias" :  "ccab1" ,  "captorId" : [1] , "metricId" : "1"  },'
    ' { "alias" :  "ccab2" ,  "captorId" : [2] , "metricId" : "1" },'
    ' { "alias" :  "ccab3" ,  "captorId" : [3] , "metricId" : "1" }]',
    1,
    '176.31.64.68',
    'Fontinettes'
	);

INSERT INTO 
    metric(metric,Unit) 
values
    ('deformation','mm');

INSERT INTO 
    sensor_groups(id,
    group_name,
    priority) 
VALUES
    (1  , 'Inclinometre',1)
    ,(2  , 'Station_Totale',1)
    ,(3  , 'Piezometre',2)
    ,(4  , 'Extensometre',2)
    ,(5  , 'Cellule_de_pression_et_de_charger' ,3)
    ,(6  , 'Sonometre',3)
    ,(7  , 'Fissurometre',3)
    ,(8  , 'Vibrometre', 4)
    ,(9  , 'Capteur_de_temperature',4)
    ,(10 , 'Tassometre',5)
    ,(11 , 'Pendule',5)
    ,(12 , 'Station_Meteorologique',5);

INSERT INTO 
    sensor_types(
    id, 
    type_name, 
    type_description, 
    type_groups, 
    extra_data, 
    specifique_extra_data) 
VALUES
     (1, 'CHAINE IC', 'Chaine inclinométrique', 1, 'drilling_name=>string, drilling_depth=>float, anchoring_depth=>float, sensors_interval=>float, Display_direction=>enum', 'position=>float, bool_bottom=>boolean')
    ,(2, 'STATION TT', 'Station totale', 2,'initial_bearing_G0=>integer, prism_number=>integer, reference_number=> integer', 'name=>string, anti_vandalisme=>enum, zone_type=>enum, prism_type=>enum, associated_station=>enum')
    ,(3, 'PIEZOMETRE RS', 'Piézomètre Résistif', 3, 'depth=>m', '')
    ,(4, 'PIEZOMETRE CV', 'Piézomètre à corde vibrante',3, 'fundamental_frequency=>Hz, thermistor=>Boolean, depth=>m', '')
    ,(5, 'EXTENSOMETRE FMP', 'Extensomètres de forage Multi points', 4,'anchor_quantity=>integer, altimetric_level=>integer, id_sensors=>integer ,Anchor_depths=>string', '')
    ,(6, 'EXTENSOMETRE CVSA(EXB)', 'Extensomètre à corde vibrante à souder par arc (EXB)', 4,'Strut_name=>string, fundamental_frequency=>Hz ,thermistor=>float', '')
    ,(7,  'EXTENSOMETRE CVSP(EXB)','Extensomètre à corde vibrante à souder par point (EXB)',4, 'Strut_name=>string , fundamental_frequency=>Hz, thermistor=>float', '')
    ,(8, 'EXTENSOMETRE CVSN(EXN)', 'Extensomètre à corde vibrante noyé (EXN)',4, 'fundamental_frequency=>Hz, thermistor=>Boolean', '' ) 
    ,(9, 'INCLINOMETRE SR', 'Inclinomètre de surface résistif', 1,'thermistor=>boolean', '')
    ,(10, 'INCLINOMETRE SCV','Inclinomètre de surface à corde vibrante',1, 'thermistor=>boolean', '')
    ,(11, 'INCLINOMETRE MEMS','Inclinomètre MEMS', 1,'thermistor=>333', '')
    ,(12, 'CELLULE P(VOUSSOIRS)','Cellule de pression (Voussoirs)', 5,'', '')
    ,(13, 'CELLULE PTT','Cellule de pression totale', 5,'', '')
    ,(14, 'SONOMETRE','Sonomètre',6, 'id_sim=>string, dyndns=>string_url, telephone_number=> string, calibration_date=>date, calibration_sheet=>pdf ', '')
    ,(15, 'FISSUROMETRE CV','Fissuromètre à corde vibrante', 7,'fundamental_frequency=>Hz, thermistor=>Boolean','')
    ,(16, 'FISSUROMETRE PTMETRIQUE','Fissuromètre potentiométrique', 7,'', '')
    ,(17, 'VIBROMETRE','Vibromètre', 8, 'id_sim=>string, dyndns=>string_url, telephone_number=>url, calibration_date=>date, calibration_sheet=>pdf', '')
    ,(18, 'CELLULE CHARGE','Cellule de charge',5, '', '')
    ,(19, 'CAPTEUR TR','Capteur de température résistif',9, '', '')
    ,(20, 'THERMOCOUPLE','Thermocouple',9, '', '')
    ,(21, 'CAPTEUR TCV','Capteur de température à corde vibrante', 9,'', '')
    ,(22, 'TASSOMETRE HD','Tassomètre hydraulique',10, 'tasso_a=>Mm/mA, tasso_b=>Mm, tasso_erreur_max=> %FS, tasso_branchement=>string', '')
    ,(23, 'PENDULES D','Pendules directs',11, '', '')
    ,(24, 'PENDULES I','Pendules inverses', 11,'', '')
    ,(25, 'STATION METOE','Station météorologique', 12,'units_system=>Enum', '')
    ,(26, 'INCLINOMETRE RAILS','Inclinomètre pour rails', 1, 'type=>enum, tiltlog_number_by_PK=>integer, pose_configuration=>ohm, track_name=>string, distance_sensor_left_track=>float, inter_track_distance=>float, inter_sensor_distance=>float', '')
    ,(27, 'PRESSUROMETRE','pressuromètre', 4, 'Strut_name=>string , fundamental_frequency=>Hz, thermistor=>float', '');

INSERT INTO sensors(sensor_name, 
    sensor_type, 
    point_x, 
    point_y, 
    point_z, 
    installation_date, 
    initial_frequency, 
    gateway_id) 
values
    ('FNT_ccab1',1,1650233,8392540,100,'12/05/2018',20,1),
    ('FNT_ccab2',2,1650234,8392542,100,'12/05/2018',20,1),
    ('FNT_ccab3',3,1650232,8392541,102,'12/05/2018',20,1),
    ('FNT_ccab4',4,1650232,8392541,102,'12/05/2018',20,1),
    ('FNT_ccab5',5,1650232,8392541,102,'12/05/2018',20,1),
    ('FNT_ccab6',6,1650232,8392541,102,'12/05/2018',20,1),
    ('FNT_ccab7',7,1650232,8392541,102,'12/05/2018',20,1),
    ('FNT_ccab8',8,1650232,8392541,102,'12/05/2018',20,1);

INSERT INTO 
    thresholds (threshold,sensor_id,metric_id) 
values
    ('"test" => "123"',1,1),
    ('"test" => "123"',2,1),
    ('"test" => "123"',3,1);

INSERT INTO 
    config_graph(site_id,type,name,sensors_id,min_x,max_x,min_y,max_y,metric) 
values
    (1,'timeseries','Config1','{1,2,3}',NULL,NULL,1200,1800,1),
    (1,'timeseries','Config2','{1,2,3}',NULL,NULL,1000,5000,1);

INSERT INTO 
    alert_contact (type, email, phone_number, sensor_id)
VALUES 
    ('Warning', 'khaledebdelli@cementys.com', '+33762555834', 3),
    ('Alert', 'khaledebdelli@cementys.com', '+33762555834', 3),
    ('Contractual', 'khaledebdelli@cementys.com', '+33762555834', 3);

--
-- Data for Name: alert_logs; Type: TABLE DATA
--

INSERT INTO alert_logs (id, created_at, count) VALUES (1, '2020-07-27 13:22:53.638181+00', 6);


--
-- Name: alert_logs_id_seq; Type: SEQUENCE SET
--

SELECT pg_catalog.setval('alert_logs_id_seq', 1, true);

--
-- Data for Name: alerts; Type: TABLE DATA
--

INSERT INTO alerts (id, type, payload, created_at) VALUES (1, 'Contractual', '"unit"=>"mm", "limit"=>"20000", "value"=>"20000.622", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"HHH", "timestamp"=>"2012-07-30T00:00:00.000Z"', '2020-07-27 13:22:53.701702+00');
INSERT INTO alerts (id, type, payload, created_at) VALUES (2, 'Warning', '"unit"=>"mm", "limit"=>"1563.6", "value"=>"1563.661", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"H", "timestamp"=>"2013-06-03T18:00:00.000Z"', '2020-07-27 13:22:53.701958+00');
INSERT INTO alerts (id, type, payload, created_at) VALUES (3, 'Warning', '"unit"=>"mm", "limit"=>"1563.6", "value"=>"1563.829", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"H", "timestamp"=>"2013-06-04T00:00:00.000Z"', '2020-07-27 13:22:53.703129+00');
INSERT INTO alerts (id, type, payload, created_at) VALUES (4, 'Warning', '"unit"=>"mm", "limit"=>"1563.6", "value"=>"1563.661", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"H", "timestamp"=>"2013-06-05T00:00:00.000Z"', '2020-07-27 13:22:53.705829+00');
INSERT INTO alerts (id, type, payload, created_at) VALUES (5, 'Contractual', '"unit"=>"mm", "limit"=>"1000", "value"=>"10.576", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"LLL", "timestamp"=>"2012-07-30T12:00:00.000Z"', '2020-07-27 13:22:53.722268+00');
INSERT INTO alerts (id, type, payload, created_at) VALUES (6, 'Warning', '"unit"=>"mm", "limit"=>"1563.6", "value"=>"1563.691", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"H", "timestamp"=>"2013-06-05T06:00:00.000Z"', '2020-07-27 13:22:54.325378+00');


--
-- Name: alerts_id_seq; Type: SEQUENCE SET
--

SELECT pg_catalog.setval('alerts_id_seq', 6, true);

--
-- Data for Name: notifications; Type: TABLE DATA
--

INSERT INTO notifications (id, receiver, read, payload, created_at, updated_at) VALUES (1, 1, true, '"id"=>"235", "type"=>"Warning", "unit"=>"mm", "limit"=>"1563.6", "value"=>"1563.661", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"H", "timestamp"=>"2013-06-05T00:00:00.000Z"', '2020-07-27 13:22:53.739495+00', '2020-07-27 13:22:53.739495+00');
INSERT INTO notifications (id, receiver, read, payload, created_at, updated_at) VALUES (2, 1, true, '"id"=>"233", "type"=>"Warning", "unit"=>"mm", "limit"=>"1563.6", "value"=>"1563.661", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"H", "timestamp"=>"2013-06-03T18:00:00.000Z"', '2020-07-27 13:22:53.793335+00', '2020-07-27 13:22:53.793335+00');
INSERT INTO notifications (id, receiver, read, payload, created_at, updated_at) VALUES (3, 1, true, '"id"=>"236", "type"=>"Contractual", "unit"=>"mm", "limit"=>"1000", "value"=>"10.576", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"LLL", "timestamp"=>"2012-07-30T12:00:00.000Z"', '2020-07-27 13:22:53.798556+00', '2020-07-27 13:22:53.798556+00');
INSERT INTO notifications (id, receiver, read, payload, created_at, updated_at) VALUES (4, 1, true, '"id"=>"234", "type"=>"Warning", "unit"=>"mm", "limit"=>"1563.6", "value"=>"1563.829", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"H", "timestamp"=>"2013-06-04T00:00:00.000Z"', '2020-07-27 13:22:53.807732+00', '2020-07-27 13:22:53.807732+00');
INSERT INTO notifications (id, receiver, read, payload, created_at, updated_at) VALUES (5, 1, true, '"id"=>"232", "type"=>"Contractual", "unit"=>"mm", "limit"=>"20000", "value"=>"20000.622", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"HHH", "timestamp"=>"2012-07-30T00:00:00.000Z"', '2020-07-27 13:22:53.809582+00', '2020-07-27 13:22:53.809582+00');
INSERT INTO notifications (id, receiver, read, payload, created_at, updated_at) VALUES (6, 1, true, '"id"=>"237", "type"=>"Warning", "unit"=>"mm", "limit"=>"1563.6", "value"=>"1563.691", "metric"=>"deformation", "sensor_id"=>"3", "threshold"=>"H", "timestamp"=>"2013-06-05T06:00:00.000Z"', '2020-07-27 13:22:54.334998+00', '2020-07-27 13:22:54.334998+00');


--
-- Name: notifications_id_seq; Type: SEQUENCE SET
--

SELECT pg_catalog.setval('notifications_id_seq', 6, true);

-- INSERT INTO dashboards (id, user_id, project_id, created_at, name, payload)
-- VALUES (1, 1, 1, '2020-09-07 07:32:47.03928+00', 'DASH001', '{
--   "lg": [{
--     "h": 13,
--     "i": "CARD_INDICATORS",
--     "w": 12,
--     "x": 0,
--     "y": 0
--   },
--   {
--     "h": 20,
--     "i": "SEARCH_SITES",
--     "w": 8,
--     "x": 0,
--     "y": 13
--   },
--   {
--     "h": 40,
--     "i": "IMAGE_CAROUSEL",
--     "w": 8,
--     "x": 0,
--     "y": 33
--   },
--   {
--     "h": 21,
--     "i": "SPECIFICATION",
--     "w": 4,
--     "x": 8,
--     "y": 78
--   },
--   {
--     "h": 38,
--     "i": "ALERT_QUICK_DETAILS",
--     "w": 4,
--     "x": 8,
--     "y": 40
--   },
--   {
--     "h": 27,
--     "i": "PROJECT_DESCRIPTION",
--     "w": 4,
--     "x": 8,
--     "y": 13
--   }],
--   "xxs": [{
--     "h": 34,
--     "i": "CARD_INDICATORS",
--     "w": 1,
--     "x": 0,
--     "y": 0
--   },
--   {
--     "h": 21,
--     "i": "SEARCH_SITES",
--     "w": 1,
--     "x": 0,
--     "y": 34
--   },
--   {
--     "h": 20,
--     "i": "IMAGE_CAROUSEL",
--     "w": 1,
--     "x": 0,
--     "y": 55
--   },
--   {
--     "h": 20,
--     "i": "SPECIFICATION",
--     "w": 1,
--     "x": 0,
--     "y": 109
--   },
--   {
--     "h": 37,
--     "i": "ALERT_QUICK_DETAILS",
--     "w": 1,
--     "x": 0,
--     "y": 129
--   },
--   {
--     "h": 34,
--     "i": "PROJECT_DESCRIPTION",
--     "w": 1,
--     "x": 0,
--     "y": 75
--   }]
-- }');

