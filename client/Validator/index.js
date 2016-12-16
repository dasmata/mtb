"use strict";

import NotEmptyValidator from "./NotEmpty";
import PhoneValidator from "./Phone";
import UniqueUsernameValidator from "./UniqueUsername";
import Float from "./Float";
import Int from "./Int";
import Between from "./Between";
import Length from "./Length";

export default {
  "notEmpty": NotEmptyValidator,
  "phone": PhoneValidator,
  "uniqueUsername": UniqueUsernameValidator,
  "float": Float,
  "int": Int,
  "between": Between,
  "length": Length
};