// @ts-ignore
import random from "random-string-alphanumeric-generator";

const codeGenerator = async () => {
	let code = await random.randomAlphanumeric(9, "lowercase");
	code = `${code.substring(0, 3)}-${code.substring(3, 6)}-${code.substring(6, 9)}`;
	return code;
};

export default codeGenerator;
