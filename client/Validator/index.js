"use strict";

import NotEmptyValidator from "./NotEmpty";
import PhoneValidator from "./Phone";
import UniqueUsernameValidator from "./UniqueUsername";

export default {
  "notEmpty": NotEmptyValidator,
  "phone": PhoneValidator,
  "uniqueUsername": UniqueUsernameValidator
};
