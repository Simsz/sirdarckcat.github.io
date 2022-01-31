class RingBufferWriter {
  constructor(typedArray, offsetBuffer) {
    this.typedArray = typedArray;
    this.maxSize = typedArray.length / 2;
    this.offsetBuffer = offsetBuffer;
    this.byteOffset = 0;
  }

  add(elements) {
    if (elements.length > this.maxSize) {
      throw new Error('Cant fit ' + elements.length);
    }
    const subView1 = new this.typedArray.constructor(
      this.typedArray.buffer, this.byteOffset, elements.length);
    const secondByteOffset = (
      this.byteOffset + (this.typedArray.byteLength / 2)
    ) % this.typedArray.byteLength;
    const subView2 = new this.typedArray.constructor(
      this.typedArray.buffer, secondByteOffset, elements.length);
    subView1.set(elements);
    subView2.set(elements);
    this.byteOffset = (
      this.byteOffset + elements.byteLength) % (this.typedArray.byteLength / 2);
    new Uint32Array(this.offsetBuffer).set([this.byteOffset]);
  }
}

class RingBufferReader {
  constructor(typedArray, offsetBuffer) {
    this.typedArray = typedArray;
    this.maxSize = typedArray.length / 2;
    this.offsetBuffer = offsetBuffer;
    this.byteOffset = 0;
  }

  last(num) {
    if(num > this.maxSize) {
      throw new Error('Cant see beyond ' + this.maxSize);
    }
    this.byteOffset = new Uint32Array(this.offsetBuffer)[0];
    const middle = this.typedArray.byteLength / 2;
    const numBytes = num * this.typedArray.BYTES_PER_ELEMENT;
    return new this.typedArray.constructor(
      this.typedArray.buffer, middle + this.byteOffset - numBytes, num);
  }
}

export {RingBufferWriter, RingBufferReader};