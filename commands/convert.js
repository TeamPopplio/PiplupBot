exports.description = '`-convert 5 km to mi`\nConvert a value between two units.'

const convert = require('convert-units');
let units = convert().possibilities();

exports.action = (msg, args) => {
    if (args) {
        if (args[0].match(/^-?\d+\.?\d*$/) && args[2] == 'to') {
            if (units.indexOf(args[1]) != -1) {
                if (units.indexOf(args[3]) != -1) {
                    if (convert().from(args[1]).possibilities().indexOf(args[3]) != -1) {
                        let result = Math.round(convert(Number(args[0])).from(args[1]).to(args[3]) * 100) / 100;
                        msg.channel.send('**Unit Conversion**', {
                            embed: {
                                fields: [{
                                        name: 'Input',
                                        value: args[0] + ' ' + (args[0] == 1 ? convert().describe(args[1]).singular : convert().describe(args[1]).plural)
                                    },
                                    {
                                        name: 'Output',
                                        value: result + ' ' + (result == 1 ? convert().describe(args[3]).singular : convert().describe(args[3]).plural)
                                    }
                                ]
                            }
                        });
                    } else {
                        msg.channel.send('Could not convert **' + convert().describe(args[1]).plural + '** to **' + convert().describe(args[3]).plural + '**!');
                    }
                } else {
                    msg.channel.send('Invalid unit `' + args[3] + '`!\nFor a list of supported units, see here: https://github.com/ben-ng/convert-units#supported-units');
                }
            } else {
                msg.channel.send('Invalid unit `' + args[1] + '`!\nFor a list of supported units, see here: https://github.com/ben-ng/convert-units#supported-units');
            }
        }
    } else {
        msg.channel.send('Invalid Syntax!\nProper Syntax: `b.convert <float> <unit> to <unit>`');
    }
}