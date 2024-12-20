const { writeHelpers } = require('../lib/helpers');

(async () => {
  try {
    await writeHelpers();
  } catch (error) {
    console.error(error);
  }
})();
