

function dir_name_to_timestamp(str) {
    const regex = /(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})/;
    let v = str.match(regex);
    v = v.splice(1 ,v.length -1);
    return new Date(years=v[0], months=v[1] -1, days=v[2], hours=+v[3]+1 , minutes=v[4]);
}

module.exports = {
    dir_name_to_timestamp: dir_name_to_timestamp
};