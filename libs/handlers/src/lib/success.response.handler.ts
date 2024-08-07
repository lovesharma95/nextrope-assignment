export class SuccessHandler {
  static getSuccessMessage(method: string, text: string): string {
    let action = '';
    switch (method.toUpperCase()) {
      case 'POST':
        action = 'created';
        break;

      case 'GET':
        action = 'found';
        break;

      case 'PUT':
        action = 'updated';
        break;

      case 'DELETE':
        action = 'deleted';
        break;

      case 'PATCH':
        action = 'updated';
        break;

      default:
        action = '';
        break;
    }

    return action === '' ? `${text} successfully` : `${text} ${action} successfully`;
  }
}
