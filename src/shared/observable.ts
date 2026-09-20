type Observer<T> = (value: T) => void;

export class Observable<T> {
  private value: T;
  private observers: Observer<T>[];

  public constructor(initialValue: T) {
    this.value = initialValue;
    this.observers = [];
  }

  public get() {
    return this.value;
  }

  public set(value: T) {
    this.value = value;
    this.notify();
  }

  private notify() {
    for (const observer of this.observers) {
      observer(this.value);
    }
  }

  public onChange(observer: Observer<T>) {
    this.observers.push(observer);
    return this;
  }
}
