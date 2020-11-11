/* eslint-disable func-names */
require('dotenv').config();
const chai = require('chai');
const sinon = require('sinon');

const projects = require('../../services/projects.service');
const db = require('../../utils/db');

const { expect } = chai;
const { stub } = sinon;

describe('module Projects', () => {
  afterEach(() => {
    sinon.restore();
  });

  beforeEach(function () {
    this.queryStub = stub(db, 'query').resolves({
      rowCount: 0,
      rows: [],
    }); // remplace la fonction "query" de "../utils/db"
    // this.stubGetProjectById = stub(projects, 'getProjectById'); // remplace la fonction "getProjectById" de "../../services/projects"
  });

  it('should return empty array if rowCount = 0', async function () {
    const response = await projects.getProjectById(1);
    expect(response).to.eql([]);
    expect(this.queryStub.callCount).to.equal(1); // "query" est bien appelé
  });
  it('should succeed', async function () {
    this.queryStub.resolves({ rowCount: 1, rows: [{ name: 'FONTINETTES' }] });
    const response = await projects.getProjectById(1);
    expect(response.name).to.equal('FONTINETTES');
    expect(this.queryStub.callCount).to.equal(1);
  });
});
