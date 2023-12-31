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

  reset() {
    this.set([]);
    this.id = 0;
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

  name(id: number) {
    return this.list.find((m) => m.id === id)?.name;
  }
}

/**
 * Payment
 */

export interface Payment extends hasId {
  payer: number;
  money: number;
  members: number[];
  memo: string;
}

class PaymentList extends List<Payment> {
  add(members: number[], money: number = 0): number {
    this.set((list) => [
      ...list,
      { id: ++this.id, payer: members[0], money, members, memo: "" },
    ]);
    return this.id;
  }

  delete(): boolean {
    if (this.list.length == 1) return false;
    this.set((list) => list.slice(0, -1));
    return true;
  }

  change<K extends keyof Payment>(id: number, key: K, value: Payment[K]) {
    this.set((p) => p.id === id, key, value);
  }

  updateMember(id: number, memberId: number) {
    const payment = this.list.find((p) => p.id === id);
    if (payment) {
      if (payment.members.find((mid) => mid === memberId))
        this.change(
          id,
          "members",
          payment.members.filter((mid) => mid !== memberId)
        );
      else this.change(id, "members", [...payment.members, memberId].sort());
    }
  }

  selectAll(id: number, list: MemberList) {
    this.change(
      id,
      "members",
      list.list.map((m) => m.id)
    );
  }

  unselectAll(id: number) {
    this.change(id, "members", []);
  }

  memo(id: number) {
    return this.list.find((p) => p.id === id)?.memo || "(내용 없음)";
  }

  isValid(): boolean {
    if (this.count === 0) return false;
    for (let i = 0; i < this.list.length; i++) {
      const p = this.list[i];
      if (p.money <= 0) return false;
      if (p.members.length === 0) return false;
    }
    return true;
  }
}

// export datas

const memberList = new MemberList();
const paymentList = new PaymentList();

export { memberList, paymentList };
