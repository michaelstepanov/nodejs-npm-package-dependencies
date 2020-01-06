/**
 * Package representation
 */
class Package
{
    constructor(name, version)
    {
        this.name = name;
        this.version = version;
    }

    static get BASE_URL() {
        return 'https://registry.npmjs.org/';
    }

    get key()
    {
        return `${this.name}@${this.version}`;
    }

    get url()
    {
        return `${Package.BASE_URL}${this.name}/${this.version}`;
    }
}

module.exports = Package;