const express = require('express');
const app = require('../index') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe('test title router connection', () => {
  it('should connect to title router', async () => {
    const response = await request.get("/api/title");
    expect(response.statusCode).toBe(200);
  })
})

describe('test title router data format', () => {
  it('should return a response of type object', async () => {
    const response = await request.get("/api/title");
    expect(typeof response).toBe("object");
  })
})

describe('test title router data', () => {
  it('should return a body containing data', async () => {
    const response = await request.get("/api/title");
    // test if response isn't empty //
    const testLength = (body) => {
      if(body.length > 0) {
        return true
      }
      return false
    }
    expect( testLength(response.body) ).toBe(true);
  })
})
