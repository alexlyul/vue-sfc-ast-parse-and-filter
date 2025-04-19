const getPrefix = () => '[sfc-ast]' + new Date().toISOString().substring(0, -1) + ': '

export const logger = (...msg: unknown[]) => {
    msg = msg.map(i => {
        if (typeof i === 'object' && i !== null) {
            return JSON.stringify(i, undefined, 2);
        }
        return i;
    });

    console.log(getPrefix(), ...msg);
}


logger.error = (error: Error | any) => {
    console.error(getPrefix(), error);
}