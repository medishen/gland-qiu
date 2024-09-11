import { expect } from "chai";
import { describe, it } from "mocha";
import { Cache } from "../../lib/cache";

describe("Cache", () => {
  it("should initialize with default max size", () => {
    const cache = new Cache<number, string>();
    expect(cache.size()).to.equal(0);
  });

  it("should initialize with custom max size", () => {
    const maxSize = 5;
    const cache = new Cache<number, string>(maxSize);
    expect(cache.size()).to.equal(0);
  });

  it("should set and get values", () => {
    const cache = new Cache<number, string>();
    cache.set(1, "one");
    expect(cache.get(1)).to.equal("one");
  });

  it("should update values on set", () => {
    const cache = new Cache<number, string>();
    cache.set(1, "one");
    cache.set(1, "updated");
    expect(cache.get(1)).to.equal("updated");
  });

  it("should evict the oldest entry when max size is exceeded", () => {
    const maxSize = 2;
    const cache = new Cache<number, string>(maxSize);
    cache.set(1, "one");
    cache.set(2, "two");
    cache.set(3, "three");
    expect(cache.get(1)).to.be.undefined; // 1 should be evicted
    expect(cache.get(2)).to.equal("two");
    expect(cache.get(3)).to.equal("three");
  });

  it("should return undefined for non-existent keys", () => {
    const cache = new Cache<number, string>();
    expect(cache.get(1)).to.be.undefined;
  });

  it("should confirm key existence with has", () => {
    const cache = new Cache<number, string>();
    cache.set(1, "one");
    expect(cache.has(1)).to.be.true;
    expect(cache.has(2)).to.be.false;
  });

  it("should clear all entries", () => {
    const cache = new Cache<number, string>();
    cache.set(1, "one");
    cache.set(2, "two");
    cache.clear();
    expect(cache.size()).to.equal(0);
    expect(cache.get(1)).to.be.undefined;
    expect(cache.get(2)).to.be.undefined;
  });

  it("should handle eviction correctly with multiple entries", () => {
    const maxSize = 3;
    const cache = new Cache<number, string>(maxSize);
    cache.set(1, "one");
    cache.set(2, "two");
    cache.set(3, "three");
    cache.set(4, "four");
    expect(cache.get(1)).to.be.undefined; // 1 should be evicted
    expect(cache.get(2)).to.equal("two");
    expect(cache.get(3)).to.equal("three");
    expect(cache.get(4)).to.equal("four");
  });

  it("should return the correct size", () => {
    const cache = new Cache<number, string>();
    cache.set(1, "one");
    cache.set(2, "two");
    expect(cache.size()).to.equal(2);
  });
});
