export enum ERROR_MESSAGE {
  MONGO_ID = 'must be an acceptable id',
  PASSWORD_MIN_LENGTH = 'password should be at least 8 character',
  PHONE_NUMBER = 'phone should be 11 digits of format 08012345678',
  TIME_SLOT = 'please provide a valid time slot',
  DATE = 'accepted date format is YYYY-MM-DD',
  ALLOWED_IMAGE_FILE_TYPE = 'Only jpg & png image format are allowed',
  PAYOUT_METHOD = 'Please provide acceptable payout method',
  USERNAME_MINLENGTH = 'Username should be atleast 4 Alphanumric character',
  BVN = 'BVN must be 11 Digits',
  FINAL_ERROR = "Something went wrong. It's not you, it's us and we are working on fixing it👌",
  FORBIDDEN = "You do not have permission to perform this action. If it's a mistake please reach out",
  UNAUTHORIZED = 'You need to login to perform this action',
}
