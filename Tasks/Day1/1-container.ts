class Integer {
  // Put implementation here
  private value: number;

  constructor(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error("value not integer");
    }
    this.value = value;
  }

  add(other: Integer): Integer {
    return new Integer(this.value + other.value);
  }

  div(other: Integer): Integer {
    try {
      return new Integer(this.value / other.value);
    } catch (error) {
      throw new Error(`div method result: ${error.message}`);
    }
  }

  gt(other: Integer): boolean {
    return this.value > other.value;
  }

  get(): number {
    return this.value;
  }
}

// Usage

const a = new Integer(7);
const b = new Integer(3);

const c = a.add(b);
const d = a.div(b);
if (a.gt(b)) {
  console.log("a > b");
}

console.log(`c = ${c.get()}`);
console.log(`d = ${d.get()}`);
