const {createHmac} = require('crypto');
const { hash, compare } = require('bcryptjs');

exports.doHash = async (value, saltValue) => {
    return await hash(value, saltValue);
};

exports.doHashValidation = async (value, hashedValue) => {
    return await compare(value, hashedValue);
};
exports.hmacProcess = (value, secret) => {
    const result = createHmac('sha256', key).update(value).digest('hex');
}