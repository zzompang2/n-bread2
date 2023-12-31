import { SetStoreFunction, createStore } from "solid-js/store";

/**
 * List
 */

interface List<T> {
  id: number;
  _list: T[];
  set: SetStoreFunction<T[]>;
}

interface hasId {
  id: number;
}

class List<T extends hasId> {
  constructor() {
    [this._list, this.set] = createStore(Array<T>());
    this.id = 0;
  }

  get list() {
    return this._list;
  }

  get count(): number {
    return this.list.length;
  }

  delete(id: number) {
    this.set((list) => list.filter((elem) => elem.id !== id));
  }
}

/**
 * Member
 */

interface Member extends hasId {
  name: string;
}

class MemberList extends List<Member> {
  exist(name: string): boolean {
    return this.list.map((m) => m.name).indexOf(name) !== -1;
  }

  add(name: string) {
    this.set((list) => [...list, { id: ++this.id, name }]);
  }
}

/**
 * Payment
 */

interface Payment extends hasId {
  payer: number;
  money: number;
  members: number[];
  memo: string;
}

class PaymentList extends List<Payment> {
  add(members: number[], payer: number = 1, money: number = 0) {
    this.set((list) => [
      ...list,
      { id: ++this.id, payer, money, members, memo: "" },
    ]);
  }

  change<K extends keyof Payment>(id: number, key: K, value: Payment[K]) {
    this.set((p) => p.id === id, key, value);
  }
}

// export datas

const memberList = new MemberList();
const paymentList = new PaymentList();

export { memberList, paymentList };