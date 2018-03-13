const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

function get_parent_dir(path) {return path.replace(/[/\\]\w+\b$/, "")}

function get_dir_list(path) {
    const isDirectory = source => lstatSync(source).isDirectory();
    const getDirectories = source =>
        readdirSync(source).map(name => join(source, name)).filter(isDirectory);
    return getDirectories(path)
}

module.exports = {
    get_parent_dir: get_parent_dir,
    get_dir_list: get_dir_list
};