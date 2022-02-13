declare module 'smartcar' {
  //   const SmartcarError: SmartcarError = SmartcarError;
  //   const Vehicle: Vehicle = Vehicle;
  //   const AuthClient: AuthClient = AuthClient;
  /**
   * Sets the version of Smartcar API you are using
   */
  function setApiVersion(version: string): void;
  /**
   * Gets the version of Smartcar API that is set
   * @returns version
   */
  function getApiVersion(): string;
  /**
   * @example
   * {
   *   id: "e0514ef4-5226-11e8-8c13-8f6e8f02e27e",
   *   meta: {
   *     requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
   *   }
   * }
   * @property id - User Id
   */
  type User = {
    id: string;
    meta: Meta;
  };
  /**
   * Return the user's id.
   * @param accessToken - access token
   */
  async function getUser(accessToken: string): Promise<User>;
  /**
   * @example
   * {
   *   vehicles: [
   *     '36ab27d0-fd9d-4455-823a-ce30af709ffc',
   *     '770bdda4-2429-4b20-87fd-6af475c4365e',
   *   ],
   *   paging: {
   *     count: 2,
   *     offset: 0,
   *   },
   *   meta: {
   *     requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
   *   }
   * }
   * @property vehicles - A list of the user's authorized vehicle ids.
   * @property paging.count- - The total number of vehicles.
   * @property paging.offset - The current start index of returned
   * vehicle ids.
   */
  type VehicleIds = {
    vehicles: string[];
    paging: {
      count: number;
      offset: number;
    };
    meta: Meta;
  };
  /**
   * Return list of the user's vehicles ids.
   * @param accessToken - access token
   * @param [paging.limit] - number of vehicles to return
   * @param [paging.offset] - index to start vehicle list
   */
  async function getVehicles(
    accessToken: string,
    paging?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<VehicleIds>;
  /**
   * @example
   * {
   *   compatible: false,
   *   meta: {
   *     requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
   *   }
   * }
   */
  type Compatibility = {
    compatible: boolean;
    meta: Meta;
  };
  /**
   * Determine whether a vehicle is compatible with Smartcar.
   *
   * A compatible vehicle is a vehicle that:
   * 1. has the hardware required for internet connectivity,
   * 2. belongs to the makes and models Smartcar supports, and
   * 3. supports the permissions.
   *
   * _To use this function, please contact us!_
   * @param vin - the VIN of the vehicle
   * @param scope - list of permissions to check compatibility for
   * @param [country = 'US'] - an optional country code according to [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   * @param [options.clientId] - client ID to use for basic auth.
   * @param [options.clientSecret] - client secret to use for basic auth.
   * @param [options.flags] - Object of flags where key is the name of the flag
   * value is string or boolean value.
   * @param [options.version] - API version to use
   */
  async function getCompatibility(
    vin: string,
    scope: string[],
    country?: string,
    options?: {
      clientId?: string;
      clientSecret?: string;
      flags?: any;
      version?: any;
    },
  ): Promise<Compatibility>;
  /**
   * Generate hash challenege for webhooks. It does HMAC_SHA256(amt, challenge)
   * @param amt - Application Management Token
   * @param challenge - Challenge string
   * @returns String representing the hex digest
   */
  function hashChallenge(amt: string, challenge: string): string;
  /**
   * Verify webhook payload with AMT and signature.
   * @param amt - Application Management Token
   * @param signature - sc-signature header value
   * @param body - webhook response body
   * @returns true if signature matches the hex digest of amt and body
   */
  function verifyPayload(amt: string, signature: string, body: any): boolean;

  /**
   * @example
   * {
   *   expiration: new Date('2017-05-26T01:21:27.070Z'),
   *   accessToken: '88704225-9f6c-4919-93e7-e0cec71317ce',
   *   refreshToken: '60a9e801-6d26-4d88-926e-5c7f9fc13486',
   *   refreshExpiration: new Date('2017-05-26T01:21:27.070Z'),
   * }
   * @property expiration - Date object which represents when the access
   * token expires.
   * @property accessToken - A token to be used for requests to the
   * Smartcar API
   * @property refreshToken - A token which is used to renew access when
   * the current access token expires, expires in 60 days
   * @property refreshExpiration - Date object which represents when the
   * refresh token expires.
   */
  declare type Access = {
    expiration: Date;
    accessToken: string;
    refreshToken: string;
    refreshExpiration: Date;
  };

  /**
   * Create a Smartcar OAuth client for your application.
   * @param options.clientId - Application client id obtained from
   * [Smartcar Developer Portal](https://developer.smartcar.com). If you do not
   * have access to the dashboard, please
   * [request access](https://smartcar.com/subscribe).
   * @param options.clientSecret - The application's client secret.
   * @param options.redirectUri - Redirect URI registered in the
   * [application settings](https://developer.smartcar.com/apps). The given URL
   * must exactly match one of the registered URLs.
   * @param [options.testMode = false] - Launch Smartcar Connect in
   * [test mode](https://smartcar.com/docs/guides/testing/).
   */
  declare class AuthClient {
    constructor(options: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      testMode?: boolean;
    });
    /**
     * Generate the Smartcar Connect URL.
     *
     * By default users are not shown the permission dialog if they have already
     * approved the set of scopes for this application. The application can elect
     * to always display the permissions dialog to the user by setting
     * approval_prompt to `force`.
     * @example
     * https://connect.smartcar.com/oauth/authorize?
     * response_type=code
     * &client_id=8229df9f-91a0-4ff0-a1ae-a1f38ee24d07
     * &scope=read_odometer read_vehicle_info
     * &redirect_uri=https://example.com/home
     * &state=0facda3319
     * &make=TESLA
     * &single_select=true
     * &single_select_vin=5YJSA1E14FF101307
     * &flags=country:DE color:00819D
     * @param [scope] - List of permissions your application
     * requires. The valid permission names are found in the [API Reference](https://smartcar.com/docs/guides/scope/)
     * @param [options.forcePrompt] - Setting `forcePrompt` to
     * `true` will show the permissions approval screen on every authentication
     * attempt, even if the user has previously consented to the exact scope of
     * permissions.
     * @param [options.singleSelect] - An optional value that sets the
     * behavior of the grant dialog displayed to the user. Object can contain two keys :
     *  - enabled - Boolean value, if set to `true`, `single_select` limits the user to
     *    selecting only one vehicle.
     *  - vin - String vin, if set, Smartcar will only authorize the vehicle with the specified VIN.
     * See the [Single Select guide](https://smartcar.com/docs/guides/single-select/) for more information.
     * @param [options.state] - OAuth state parameter passed to the
     * redirect uri. This parameter may be used for identifying the user who
     * initiated the request.
     * @param [options.makeBypass] - An optional parameter that allows
     * users to bypass the car brand selection screen.
     * For a complete list of supported makes, please see our
     * [API Reference](https://smartcar.com/docs/api#authorization) documentation.
     * @param [options.flags] - Object of flags where key is the name of the flag
     * value is string or boolean value.
     * @returns Smartcar Connect URL to direct user to.
     */
    getAuthUrl(
      scope?: string[],
      options?: {
        forcePrompt?: boolean;
        singleSelect?: boolean | any;
        state?: string;
        makeBypass?: any;
        flags?: any;
      },
    ): string;
    /**
     * Exchange an authorization code for an access object.
     * @param code - Authorization code to exchange for a Smartcar
     * access token and refresh token.
     * @param [options.flags] - Object of flags where key is the name of the flag
     * value is string or boolean value.
     * @returns New set of Access and Refresh tokens.
     */
    exchangeCode(code: string): Access;
    /**
     * Exchange a refresh token for a new access object.
     * @param token - Refresh token to exchange for a new set of Access and
     * Refresh tokens.
     * @param [options.flags] - Object of flags where key is the name of the flag
     * value is string or boolean value.
     * @returns New set of Access and Refresh tokens.
     */
    exchangeRefreshToken(token: string): Access;
  }

  /**
   * Class to handle all errors from Smartcar API
   * Please see our [error guides]{@link https://smartcar.com/docs} to see a list
   * of all the possible error types and codes of both v2.0 and v1.0 requests.
   * @param status - response status
   * @param body - response body
   * @param headers - response headers
   */
  declare class SmartcarError {
    constructor(status: number, body: any, headers: any);
    /**
     * Legacy field from V1 error depicting a category/type/description
     * of the error.
     */
    static error: string;
    /**
     * Error message field inherited from StandardError
     */
    static message: string;
    /**
     * Description of meaning of the error.
     */
    static description: string;
    /**
     * Type of error
     */
    static type: string;
    /**
     * Error code
     */
    static code: string;
    /**
     * HTTP status code
     */
    static statusCode: number;
    /**
     * Unique identifier for request
     */
    static requestId: string;
    /**
     * Possible resolution for fixing the error
     */
    static resolution: SmartcarError.Resolution;
    /**
     * Reference to Smartcar documentation
     */
    static docURL: string;
    /**
     * Further detail about the error in form of array of objects
     */
    static details: Record<string, unknown>[];
  }

  declare namespace SmartcarError {
    /**
     * @property type - Possible hint to fixing the issue
     * @property url - A URL to help resolve the issue or resume the operation
     */
    type Resolution = {
      type: string;
      url: string;
    };
  }

  /**
   * Initializes a new Service object to make requests to the Smartcar API.
   * @param [options.baseUrl] - Host/Base URL for the requests
   * @param [options.auth] - authorization options
   * @param [options.headers] - headers to add
   */
  declare class SmartcarService {
    constructor(options?: { baseUrl?: string; auth?: any; headers?: any });
  }

  /**
   * Every key here is the function name on vehicle
   * This map is used to generate the methods dynamically. Every value is an object of
   * the following fields :
   * - requestType: http request type, defaults to 'get' if not mentioned.
   * - path: url path to hit, defaults to the method name
   * - body: body for post requests.
   */
  declare const METHODS_MAP: {
    [key: string]: Record<string, unknown>;
  };

  /**
   * Initializes a new Vehicle to use for making requests to the Smartcar API.
   * @param id - The vehicle's unique identifier. Retrieve a user's
   * vehicle id using {@link module:smartcar.getVehicles}.
   * @param token - A valid access token
   * @param [options.unitSystem = metric] - The unit system to use for vehicle data
   * must be either `metric` or `imperial`.
   * @param [options.version] - API version to use
   */
  declare class Vehicle {
    constructor(
      id: string,
      token: string,
      options?: {
        unitSystem?: string;
        version?: any;
      },
    );
    /**
     * Fetch the list of permissions that this application has been granted
     * @param [paging.limit] - number of permissions to return
     * @param [options.offset] - The current start index of the returned list of elements.
     */
    async permissions(paging?: { limit?: string }): Promise<Permissions>;
    /**
     * Subscribe the vehicle to given webhook Id
     * @param webhookId - Webhook Id to subscribe to.
     */
    async subscribe(webhookId: string): Promise<any>;
    /**
     * Unsubscribe  the vehicle from given webhook Id
     * @param amt - Application management token to be used as authorization
     * @param webhookId - Webhook Id to unsubscribe from.
     */
    async unsubscribe(amt: string, webhookId: string): Promise<Meta>;
    /**
     * Make batch requests for supported items
     * @param paths - A list of paths of endpoints to send requests to.
     */
    async batch(paths: string[]): Promise<Batch>;
    /**
     * Returns the vehicle's manufacturer identifier (VIN).
     */
    async vin(): Promise<Vin>;
    /**
     * Returns the current charge status of the vehicle.
     */
    async charge(): Promise<Charge>;
    /**
     * Returns the state of charge (SOC) and remaining range of an electric or
     * plug-in hybrid vehicle's battery.
     */
    async battery(): Promise<Battery>;
    /**
     * Returns the capacity of an electric or plug-in hybrid vehicle's battery.
     */
    async batteryCapacity(): Promise<BatteryCapacity>;
    /**
     * Returns the status of the fuel remaining in the vehicle's gas tank.
     */
    async fuel(): Promise<Fuel>;
    /**
     * Returns the air pressure of each of the vehicle's tires.
     */
    async tirePressure(): Promise<TirePressure>;
    /**
     * Returns the remaining life span of a vehicle's engine oil
     */
    async engineOil(): Promise<EngineOil>;
    /**
     * Returns the vehicle's last known odometer reading.
     */
    async odometer(): Promise<Odometer>;
    /**
     * Returns the last known location of the vehicle in geographic coordinates.
     */
    async location(): Promise<Location>;
    /**
     * Returns make model year and id of the vehicle
     */
    async attributes(): Promise<Attributes>;
    /**
     * Attempts to lock the vehicle.
     */
    async lock(): Promise<ActionResponse>;
    /**
     * Attempts to lock the vehicle.
     */
    async unlock(): Promise<ActionResponse>;
    /**
     * Attempts to start charging the vehicle.
     */
    async startCharge(): Promise<ActionResponse>;
    /**
     * Attempts to stop charging the vehicle.
     */
    async stopCharge(): Promise<ActionResponse>;
    /**
     * Disconnect this vehicle from the connected application.
     * Note: Calling this method will invalidate your token's access to the vehicle.
     * You will have to reauthorize the user to your application again if you wish
     * to make requests to it again.
     */
    async disconnect(): Promise<ActionResponse>;
  }

  /**
   * @example
   * {
   *   permissions: ['read_vehicle_info'],
   *   paging: {
   *      count: 25,
   *      offset: 10
   *   },
   *   meta: {
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property permissions - An array of permissions names.
   * @property [paging.count] - The total number of elements for the entire query
   * (not just the given page).
   * @property [options.offset] - The current start index of the returned list of elements.
   */
  declare type Permissions = {
    permissions: string[];
    paging?: {
      count?: number;
    };
    meta: Meta;
  };

  /**
   * @example
   * {
   *   webhookId: 'dd214915-0c26-13c5-8e42-7edfc2ab320a',
   *   vehicleId: '19c0cc8c-80e0-4182-9372-6ef903c7599c',
   *   meta: {
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property webhookId - Webhook Id that the vehicle was subscribed to
   * @property vehicleId - Current vehicle id that was subscribed to the webhook
   */
  declare type WebhookSubscription = {
    webhookId: string;
    vehicleId: string;
    meta: Meta;
  };

  /**
   * @example
   * {
   *    "odometer" : function() => returns odometer object or throws SmartcarError,
   *    "location" : function() => returns odometer location or throws SmartcarError,
   * }
   * @property ENDPOINT - The response object for a given ENDPOINT where
   * ENDPOINT is a Smartcar endpoint (i.e. /odometer, /fuel) or throws SmartcarError
   * if the endpoint resulted in an error.
   */
  declare type Batch = {
    ENDPOINT: (...params: any[]) => any;
  };

  /**
   * @example
   * {
   *   requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
   *   dataAge: new Date('2018-05-04T07:20:50.844Z'),
   *   unitSystem: 'imperial',
   * }
   * @property dataAge - The timestamp of when the data was recorded; returned if applicable.
   * @property requestId - The smartcar request ID for debugging
   * @property unitSystem - Unit system used, metric or imperial; returned if applicable.
   */
  declare type Meta = {
    dataAge: Date;
    requestId: string;
    unitSystem: string;
  };

  /**
   * @example
   * {
   *   vin: '12345678901234567',
   *   meta: {
   *     requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
   *   }
   * }
   * @property vin - VIN of the vehicle
   */
  declare type Vin = {
    vin: string;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   isPluggedIn: false,
   *   state: "FULLY_CHARGED",
   *   meta: {
   *     dataAge: new Date('2018-05-04T07:20:50.844Z'),
   *   }
   * }
   * @property isPluggedIn - Indicates whether charging cable is
   *   plugged in.
   * @property state - Indicates the current state of the charge
   *   system. Can be `FULLY_CHARGED`, `CHARGING`, or `NOT_CHARGING`.
   */
  declare type Charge = {
    isPluggedIn: boolean;
    state: string;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   range: 40.5,
   *   percentRemaining: 0.3,
   *   meta: {
   *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
   *    unitSystem: 'imperial',
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property range - The estimated remaining distance the car can
   *  travel (in kms or miles). Unit is passed as a parameter in vehicle constructor.
   * @property percentRemaining - The remaining level of charge in
   *   the battery (in percent).
   */
  declare type Battery = {
    range: number;
    percentRemaining: number;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   capacity: 24,
   *   meta: {
   *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
   *    unitSystem: 'imperial',
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property capacity - The total capacity of the vehicle's battery
   * (in kilowatt-hours)
   */
  declare type BatteryCapacity = {
    capacity: number;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   range: 40.5,
   *   percentRemaining: 0.3,
   *   amountRemaining: 40.5,
   *   meta: {
   *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
   *    unitSystem: 'imperial',
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property range - The estimated remaining distance the car can
   *  travel (in kms or miles). Unit is passed as a parameter in vehicle constructor.
   * @property percentRemaining - The remaining level of fuel in
   *   the tank (in percent).
   * @property amountRemaining - The amount of fuel in the tank (in
   *  liters or gallons (US)). Unit is passed as a parameter in vehicle constructor.
   */
  declare type Fuel = {
    range: number;
    percentRemaining: number;
    amountRemaining: number;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   frontleft: 33,
   *   frontRight: 34,
   *   backLeft: 34,
   *   backRight: 33
   *   meta: {
   *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
   *    unitSystem: 'imperial',
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property frontLeft - The current air pressure of the front left tire
   * @property frontRight - The current air pressure of the back right tire
   * @property backLeft - The current air pressure of the back left tire
   * @property backRight - The current air pressure of the back right tire
   */
  declare type TirePressure = {
    frontLeft: number;
    frontRight: number;
    backLeft: number;
    backRight: number;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   lifeRemaining: 0.86,
   *   meta: {
   *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
   *    unitSystem: 'imperial',
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property lifeRemaining - The engine oil's remaining life span
   * (as a percentage). Oil life is based on the current quality of the oil.
   */
  declare type EngineOil = {
    lifeRemaining: number;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   distance: 1234.12,
   *   meta: {
   *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
   *    unitSystem: 'imperial',
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property distance - The reading of the vehicle's odometer (in
   *   kms or miles). Unit is passed as a parameter in vehicle constructor.
   */
  declare type Odometer = {
    distance: number;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   latitude: 37.400880,
   *   longitude: -122.057804,
   *   meta: {
   *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
   *    unitSystem: 'imperial',
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property latitude - The vehicle latitude (in degrees).
   * @property longitude - The vehicle longitude (in degrees).
   */
  declare type Location = {
    latitude: number;
    longitude: number;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   id: '19c0cc8c-80e0-4182-9372-6ef903c7599c',
   *   make: 'TESLA',
   *   model: 'S',
   *   year: 2017,
   *   meta: {
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property id - The vehicle's unique Smartcar identifier.
   * @property make - The brand of the vehicle.
   * @property model - The specific model of the vehicle.
   * @property year - The model year of the vehicle.
   */
  declare type Attributes = {
    id: string;
    make: string;
    model: string;
    year: number;
    meta: Meta;
  };

  /**
   * @example
   * {
   *   status: 'success',
   *   meta: {
   *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   *   }
   * }
   * @property status - set to `success` on successful request
   */
  declare type ActionResponse = {
    status: string;
    meta: Meta;
  };
}
