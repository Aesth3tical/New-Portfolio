class Command {
    constructor({ name, description, options, category, permissions, cooldown }) {
        this.name = name;
        this.description = description;
        this.options = options;
        this.category = category;
        this.default_member_permissions = permissions;
        this.cooldown = cooldown;
    }
}

module.exports = Command;