require("babel/register")({
    stage: 1,
    ignore:[ 'uuid.js', 'rx.js', 'moment','ges-client', 'winston', 'nested-error']
});