import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { SmartcarError } from 'smartcar';

const TEMPORARY_CONNECTION_ERROR_MESSAGE =
  'Your vehicle is temporarily unable to connect to EV Charging Analyser. Please be patient while we work to resolve this issue.';

const MAKE_NOT_COMPATIBLE_ERROR_MESSAGE =
  'Your vehicle is not compatible with EV Charging Analyser';
const SMARTCAR_NOT_CAPABLE_ERROR_MESSAGE =
  "We're currently unable to support this feature for your vehicle";
const VEHICLE_NOT_CAPABLE_ERROR_MESSAGE =
  'Your vehicle is unable to perform this request';

const ACCOUNT_ISSUE_ERROR_MESSAGE =
  'Action required in your connected services account. Please log into your connected services app or web portal and complete any outstanding tasks (e.g. finish activating your account or accept the Terms of Service).';
const AUTHENTICATION_FAILED_ERROR_MESSAGE =
  'Your vehicle got disconnected from EV Charging Analyser. Please use the add vehicle button on the Cars screen.';
const NO_VEHICLES_ERROR_MESSAGE =
  'No vehicles found in your connected services account. Please ensure that you have added your vehicle to your account and that you have activated its connected services. Then go back to EV Charging Analyser to connect your vehicle.';
const VEHICLE_MISSING_ERROR_MESSAGE =
  'This vehicle is no longer associated with your connected services account. Please log into your account and re-add this vehicle.';

const ASLEEP_ERROR_MESSAGE =
  'Your vehicle is temporarily unable to connect to EV Charging Analyser. To re-establish the connection, please start your car and take it for a short drive.';
const CHARGING_IN_PROGRESS_ERROR_MESSAGE = 'Your vehicle is already charging';
const CHARGING_PLUG_NOT_CONNECTED_ERROR_MESSAGE =
  "Your vehicle isn't able to start charging. Please ensure that you have plugged an EV charger into your car's charge port.";
const DOOR_OPEN_ERROR_MESSAGE =
  'Your vehicle was unable to lock. Please ensure that all doors and the boot are fully closed.';
const FULLY_CHARGED_ERROR_MESSAGE = 'Your vehicle is already fully charged.';
const HOOD_OPEN_ERROR_MESSAGE =
  "Your vehicle was unable to lock. Please ensure that your car's bonnet is fully closed.";
const IGNITION_ON_ERROR_MESSAGE =
  "Your vehicle is temporarily unable to connect to EV Charging Analyser because its motor is running. To re-establish the connection, please turn off your vehicle's motor.";
const IN_MOTION_ERROR_MESSAGE =
  'Your vehicle is in motion and temporarily unable to connect to EV Charging Analyser. To re-establish the connection, please park your car and turn off its engine.';
const REMOTE_ACCESS_DISABLED_ERROR_MESSAGE =
  "Your vehicle is temporarily unable to connect to EV Charging Analyser. To re-establish the connection, please make sure that remote access for connected services is enabled inside your vehicle. Please refer to your vehicle's owner manual for more details.";
const TRUNK_OPEN_ERROR_MESSAGE =
  "Your vehicle was unable to lock. Please ensure that your car's boot (and front boot) is closed.";
const UNREACHABLE_ERROR_MESSAGE =
  'Your vehicle is temporarily unable to connect to EV Charging Analyser. To re-establish the connection, please move your car to a location with a better mobile phone signal.';
const VEHICLE_OFFLINE_FOR_SERVICE_ERROR_MESSAGE =
  'Your vehicle is in service mode and temporarily unable to connect to EV Charging Analyser. Please try again later.';

const PERMISSION_ERROR_MESSAGE =
  'EV Charging Analyser does not yet have permission to perform this action to your vehicle. Please reconnect your vehicle to EV Charging Analyser.';

const UNKNOWN_ERROR_MESSAGE =
  'An unknown error has occurred with EV Charging Analyser';

@Catch(SmartcarError)
export class SmartCarExceptionFilter implements ExceptionFilter {
  catch(exception: SmartcarError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { type, code } = exception;

    const message = this.getErrorMessage(exception);

    response.status(exception.statusCode).json({
      type,
      code,
      message,
    });
  }

  getCompatibilityErrorMessage(exception: SmartcarError): string {
    switch (exception.code) {
      case 'MAKE_NOT_COMPATIBLE':
        return MAKE_NOT_COMPATIBLE_ERROR_MESSAGE;
      case 'SMARTCAR_NOT_CAPABLE':
        return SMARTCAR_NOT_CAPABLE_ERROR_MESSAGE;
      case 'VEHICLE_NOT_CAPABLE':
        return VEHICLE_NOT_CAPABLE_ERROR_MESSAGE;
      default:
        return UNKNOWN_ERROR_MESSAGE;
    }
  }

  getConnectedServicesErrorMessage(exception: SmartcarError): string {
    switch (exception.code) {
      case 'ACCOUNT_ISSUE':
        return ACCOUNT_ISSUE_ERROR_MESSAGE;
      case 'AUTHENTICATION_FAILED':
        return AUTHENTICATION_FAILED_ERROR_MESSAGE;
      case 'NO_VEHICLES':
        return NO_VEHICLES_ERROR_MESSAGE;
      case 'VEHICLE_MISSING':
        return VEHICLE_MISSING_ERROR_MESSAGE;
      default:
        return UNKNOWN_ERROR_MESSAGE;
    }
  }

  getVehicleStateErrorMessage(exception: SmartcarError): string {
    switch (exception.code) {
      case 'ASLEEP':
        return ASLEEP_ERROR_MESSAGE;
      case 'CHARGING_IN_PROGRESS':
        return CHARGING_IN_PROGRESS_ERROR_MESSAGE;
      case 'CHARGING_PLUG_NOT_CONNECTED':
        return CHARGING_PLUG_NOT_CONNECTED_ERROR_MESSAGE;
      case 'DOOR_OPEN':
        return DOOR_OPEN_ERROR_MESSAGE;
      case 'FULLY_CHARGED':
        return FULLY_CHARGED_ERROR_MESSAGE;
      case 'HOOD_OPEN':
        return HOOD_OPEN_ERROR_MESSAGE;
      case 'IGNITION_ON':
        return IGNITION_ON_ERROR_MESSAGE;
      case 'IN_MOTION':
        return IN_MOTION_ERROR_MESSAGE;
      case 'REMOTE_ACCESS_DISABLED':
        return REMOTE_ACCESS_DISABLED_ERROR_MESSAGE;
      case 'TRUNK_OPEN':
        return TRUNK_OPEN_ERROR_MESSAGE;
      case 'UNREACHABLE':
        return UNREACHABLE_ERROR_MESSAGE;
      case 'VEHICLE_OFFLINE_FOR_SERVICE':
        return VEHICLE_OFFLINE_FOR_SERVICE_ERROR_MESSAGE;
      case 'UNKNOWN':
      default:
        return UNKNOWN_ERROR_MESSAGE;
    }
  }

  getErrorMessage(exception: SmartcarError): string {
    switch (exception.type) {
      case 'BILLING':
      case 'UPSTREAM':
      case 'VALIDATION':
      case 'AUTHENTICATION':
      case 'RATE_LIMIT':
      case 'INTERNAL':
      case 'PATH':
      case 'VERSION':
        return TEMPORARY_CONNECTION_ERROR_MESSAGE;
      case 'COMPATIBILITY':
        return this.getCompatibilityErrorMessage(exception);
      case 'CONNECTED_SERVICES_ACCOUNT':
        return this.getConnectedServicesErrorMessage(exception);
      case 'VEHICLE_STATE':
        return this.getVehicleStateErrorMessage(exception);
      case 'PERMISSION':
        return PERMISSION_ERROR_MESSAGE;
      default:
        return UNKNOWN_ERROR_MESSAGE;
    }
  }
}
