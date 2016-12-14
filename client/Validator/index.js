"use strict";

import NotEmptyValidator from "./NotEmpty";
import PhoneValidator from "./Phone";
import UniqueUsernameValidator from "./UniqueUsername";

export default {
  "notEmpty": new NotEmptyValidator(),
  "phone": new PhoneValidator(),
  "uniqueUsername": new UniqueUsernameValidator()
};
