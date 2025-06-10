import { describe, beforeAll, afterAll, afterEach, it, expect } from "@jest/globals";
import { Pact, PactV3, PactV4 } from "@pact-foundation/pact";
import { string } from "@pact-foundation/pact/src/dsl/matchers";
import axios from "axios";
import * as path from "path";
import * as http from "http";

describe("PUT Pact Consumer", () => {

  const pactProvider = new Pact({
    dir: path.resolve(process.cwd(), "pact-contracts"),
    consumer: "Pact feat1 consumer",
    provider: "feat1 provider",
  });

  let port: number;

  beforeAll(async () => {
    await pactProvider.setup();
    port = pactProvider.opts.port;
  });

  afterAll(() => pactProvider.finalize());

  afterEach(() => pactProvider.verify());

  it("happy path", async () => {
    await pactProvider.addInteraction({
      state: 'Hello API',
      uponReceiving: 'a request to update with body',
      withRequest: {
        method: "PUT",
        path: "/hello",
        headers:
        {
          "Content-Type": "application/json",
        },
        body: {
          message: "Hello, World!",
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          message: string("Updated. Hello, World!"),
        }
      }
    });

    const response = await axios.request({
      baseURL: `http://127.0.0.1:${port}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      url: "/hello",
      data: {
        message: "Hello, World!",
      },
      httpAgent: new http.Agent({ keepAlive: true }),
    });
    expect(response.data).toEqual({
      message: "Updated. Hello, World!",
    });
    expect(response.status).toBe(200);
  });


  it("should return error when empty body request", async () => {
    await pactProvider.addInteraction({
      state: 'Hello API',
      uponReceiving: 'a request to update with empty body',
      withRequest: {
        method: "PUT",
        path: "/hello",
        headers:
        {
          "Content-Type": "application/json",
        },
        body: {

        }
      },
      willRespondWith: {
        status: 400,
      }
    });

    await expect(axios.request({
      baseURL: `http://127.0.0.1:${port}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      url: "/hello",
      data: {},
      httpAgent: new http.Agent({ keepAlive: true }),
    })).rejects.toThrow('Request failed with status code 400');
  });
});


describe("PUT PactV3", () => {
  const pactV3Provider = new PactV3({
    dir: path.resolve(process.cwd(), "pact-contracts"),
    consumer: "PactV3 feat1 consumer",
    provider: "feat1 provider",
  });

  it("happy path", async () => {
    pactV3Provider.addInteraction({
      states: [{ description: 'Hello API' }],
      uponReceiving: 'a request to update with body',
      withRequest: {
        method: "PUT",
        path: "/hello",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          message: "Hello, World!",
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          message: string("Updated. Hello, World!"),
        }
      }
    });

    await pactV3Provider.executeTest(async (mockService) => {
      const response = await axios.request({
        baseURL: `http://127.0.0.1:${mockService.port}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        url: "/hello",
        data: {
          message: "Hello, World!",
        },
        httpAgent: new http.Agent({ keepAlive: true }),
      });
      expect(response.data).toEqual({
        message: "Updated. Hello, World!",
      });
      expect(response.status).toBe(200);
    });
  });

  it("should return error when empty body request", async () => {
    pactV3Provider.addInteraction({
      states: [{ description: 'Hello API' }],
      uponReceiving: 'a request to update with empty body',
      withRequest: {
        method: "PUT",
        path: "/hello",
        headers: {
          "Content-Type": "application/json",
        },
        body: {}
      },
      willRespondWith: {
        status: 400,
      }
    });

    await pactV3Provider.executeTest(async (mockService) => {
      await expect(axios.request({
        baseURL: `http://127.0.0.1:${mockService.port}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        url: "/hello",
        data: {},
        httpAgent: new http.Agent({ keepAlive: true }),
      })).rejects.toThrow('Request failed with status code 400');
    });
  });
});

describe("PUT PactV4", () => {
  const pactV4Provider = new PactV4({
    dir: path.resolve(process.cwd(), "pact-contracts"),
    consumer: "PactV4 feat1 consumer",
    provider: "feat1 provider",
  });

  it("happy path", async () => {
    const interaction = pactV4Provider
      .addInteraction()
      .given('Hello API')
      .uponReceiving('a request to update with body')
      .withRequest("PUT", "/hello", (builder) => {
        builder.headers({
          "Content-Type": "application/json"
        });
        builder.jsonBody({
          message: "Hello, World!",
        });
      })
      .willRespondWith(200, (builder) => {
        builder.jsonBody({
          message: string("Updated. Hello, World!"),
        });
      });

    await interaction.executeTest(async (mockService) => {
      const response = await axios.request({
        baseURL: `http://127.0.0.1:${mockService.port}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        url: "/hello",
        data: {
          message: "Hello, World!",
        },
        httpAgent: new http.Agent({ keepAlive: true }),
      });
      expect(response.data).toEqual({
        message: "Updated. Hello, World!",
      });
      expect(response.status).toBe(200);
    });
  });

  it("should return error when empty body request", async () => {
    const interaction = pactV4Provider
      .addInteraction()
      .given('Hello API')
      .uponReceiving('a request to update with empty body')
      .withRequest("PUT", "/hello", (builder) => {
        builder.headers({
          "Content-Type": "application/json"
        });
        builder.jsonBody({});
      })
      .willRespondWith(400);

    await interaction.executeTest(async (mockService) => {
      await expect(axios.request({
        baseURL: `http://127.0.0.1:${mockService.port}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        url: "/hello",
        data: {},
        httpAgent: new http.Agent({ keepAlive: true })
      })).rejects.toThrow('Request failed with status code 400');
    });
  });
});