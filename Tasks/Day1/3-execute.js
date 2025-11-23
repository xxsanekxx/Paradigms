"use strict";

const reader = ({ id }) => ({ id, name: "marcus", age: 42 });

const execute =
  (plan) =>
  (reader, log, env = {}) => {
    if (plan.read) {
      const user = reader(plan.read);
      return execute(plan.then)(reader, log, { user });
    }
    if (plan.match) {
      const ok = env.user.name === plan.match.name;
      return execute(ok ? plan.success : plan.fail)(reader, log, env);
    }
    if (plan.effect) {
      if (plan.effect.log) return () => log(env.user[plan.effect.log]);
      if (plan.effect === "noop") return () => {};
    }
  };

execute({
  read: { id: 15 },
  then: {
    match: { name: "marcus" },
    success: { effect: { log: "age" } },
    fail: { effect: "noop" },
  },
})(reader, console.log)();

const matchEffect = {
  data: { name: "marcus" },
  effects: {
    success: {
      effects: {
        log: {
          data: { field: "age" },
        },
      },
    },
    fail: {
      effects: {},
    },
  },
};

const plan = {
  read: {
    data: { id: 15 },
    effects: {
      match: matchEffect,
    },
  },
};

class Exec {
  #reader;
  #logger;
  #env;
  constructor({ reader, logger, env = {} }) {
    this.#reader = reader;
    this.#logger = logger;
    this.#env = env;
  }

  run(plan) {
    let result;
    for (const key in plan) {
      result = this.#execute(key, plan[key], result);
    }
    return result;
  }

  #execute(name, effect, prevResult) {
    const { data, effects } = effect;

    if (name === "read") {
      if (!data) {
        throw new Error("Data is required for read effect");
      }

      return this.#read(data, effects);
    }

    if (name === "match") {
      if (!data) {
        throw new Error("Data is required for match effect");
      }

      return this.#match(prevResult, data, effects);
    }

    if (name === "success") {
      return this.#success(prevResult, effects);
    }

    if (name === "fail") {
      return this.#fail(effects);
    }

    if (name === "log") {
      if (!data) {
        throw new Error("Data is required for log effect");
      }

      return this.#log(prevResult, data);
    }
  }

  #read(data, effects) {
    let result = this.#reader(data);
    this.#applyEffects(effects, result);
    return result;
  }

  #match(value, valueToCompare, effects) {
    let ok = true;

    if (value !== valueToCompare) {
      for (const key in valueToCompare) {
        if (value[key] !== valueToCompare[key]) {
          ok = false;
        }
      }
    }

    if (effects) {
      if (!ok && effects.fail) {
        return this.#execute("fail", effects.fail);
      }
      if (ok && effects.success) {
        return this.#execute("success", effects.success, value);
      }
    }
  }

  #log(data, logScheme, effects) {
    if (logScheme.field) {
      this.#logger(data[logScheme.field]);
    }

    this.#applyEffects(effects, data);
  }

  #fail(effects) {
    this.#applyEffects(effects, null);
  }

  #success(data, effects) {
    this.#applyEffects(effects, data);
  }

  #applyEffects(effects, data) {
    let result = data;
    if (effects) {
      for (const effectKey in effects) {
        result = this.#execute(effectKey, effects[effectKey], result);
      }
    }
    return result;
  }
}

// 1. Rewrite in OOP style
// 2. Improve data structure inconsistence

const main = new Exec({reader, logger: console.log});
main.run(plan);
