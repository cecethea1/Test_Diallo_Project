/* eslint-disable func-names */
require('dotenv').config();
const chai = require('chai');
const sinon = require('sinon');

const user = require('../../services/users.service');
const db = require('../../utils/db');

const { expect } = chai;
const { stub } = sinon;

describe('module authenticateUser', () => {
  afterEach(() => {
    sinon.restore();
  });

  beforeEach(function () {
    sinon.restore();
    this.queryStub = stub(db, 'query').resolves({
      rowCount: 0,
      rows: [],
    }); // remplace la fonction "query" de "../utils/db"
    this.stubGetCompanies = stub(user, 'getCompanies').resolves([
      { id: 3, name: 'Company-3' },
    ]);
    this.stubValidateJwt = stub(user, 'validateJwt').resolves({ id: 1, email: 'toto@toto.fr' });
  });

  it('should throw an error if query fail', async function () {
    this.queryStub.rejects(new Error('Bad credentials')); // lors de l'appel "db.query" une erreur sera émise
    try {
      await user.authenticateUser('toto@toto.fr', 'tata');
    } catch (err) {
      expect(err.message).to.equal('Bad credentials');
      expect(this.queryStub.callCount).to.equal(1); // "query" est bien appelé
      expect(this.stubGetCompanies.callCount).to.equal(0);
      return;
    }
    throw new Error('Should have thrown an error');
  });

  it('should throw an error if query return 0 row', async function () {
    try {
      await user.authenticateUser('toto@toto.fr', 'tata');
    } catch (err) {
      expect(err.message).to.equal('Bad credentials'); // Si la requête de renvoi pas de résultat alors une erreur "bad credentials" est émise
      expect(this.queryStub.callCount).to.equal(1);
      expect(this.stubGetCompanies.callCount).to.equal(0);
      return;
    }
    throw new Error('Should have thrown an error');
  });

  // it('should succeed', async function () {
  //   this.queryStub.resolves({ rowCount: 1, rows: [{ id: 1, email: 'toto@toto.fr' }] });
  //   const authUser = await user.authenticateUser('toto@toto.fr', 'tata');
  //   const decodedUser = await this.stubValidateJwt(authUser, 'secret');
  //   expect(decodedUser.email).to.equal('toto@toto.fr');
  //   // expect(this.stubGetCompanies.callCount).to.equal(0);
  // });
});
