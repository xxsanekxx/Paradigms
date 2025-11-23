"use strict";
class User {
    #id;
    #name;
    constructor(id, name) {
        this.#id = id;
        this.#name = name;
    }
    toJson() {
        return JSON.stringify({ id: this.#id, name: this.#name });
    }
    get [Symbol.toStringTag]() {
        return this.toJson();
    }
}
const user = new User(15, "Marcus");
console.log(user.toString());
console.log(user.toJson());
