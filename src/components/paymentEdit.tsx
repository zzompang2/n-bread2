import { Accessor, For, Match, Switch, createEffect } from "solid-js";
import { memberList, Payment, paymentList } from "~/systems/data";
import Reset from "~/public/assets/icons/reset";
import { TEXT } from "~/systems/text";

interface Props {
  selectedSection: number;
  payment: Payment;
}

export default function PaymentEdit(props: Props) {
  let memoRef: HTMLInputElement;
  let moneyRef: HTMLInputElement;

  const changeMemo = (e: Event) => {
    e.preventDefault();
    memoRef.blur();
    memoRef.value = memoRef.value.trim();
    paymentList.change(props.payment.id, "memo", memoRef.value.trim());
  };

  const cleanMemo = () => {
    memoRef.value = "";
    paymentList.change(props.payment.id, "memo", "");
  };

  const changeMoney = (e: Event) => {
    e.preventDefault();
    moneyRef.blur();
    if (Number(moneyRef.value) > 0 && Number(moneyRef.value) < 1000000000000)
      paymentList.change(props.payment.id, "money", Number(moneyRef.value));
    else moneyRef.value = String(props.payment.money);
  };

  createEffect(() => {
    if (props.selectedSection === 1) memoRef?.select();
    else if (props.selectedSection === 3) moneyRef?.select();
  });

  return (
    <div class="payment_editer">
      <Switch>
        <Match when={props.selectedSection === 1}>
          <div class="list">
            <For each={memberList.list}>
              {(member) => (
                <div
                  class={
                    "option" +
                    (props.payment.payer === member.id ? " selected" : "")
                  }
                  onclick={() =>
                    paymentList.change(props.payment.id, "payer", member.id)
                  }
                >
                  {member.name}
                </div>
              )}
            </For>
          </div>
          <form class="label_input" onsubmit={changeMemo}>
            <input
              class="input_memo"
              value={props.payment.memo}
              placeholder={TEXT.paymentItem.placeholderMemo}
              ref={(ref) => (memoRef = ref)}
              onchange={changeMemo}
            />
            <div class="button_reset" onclick={cleanMemo}>
              <Reset />
            </div>
          </form>
        </Match>
        <Match when={props.selectedSection === 2}>
          <div class="list">
            <For each={memberList.list}>
              {(member) => (
                <div
                  class={
                    "option" +
                    (props.payment.members.find((mid) => mid === member.id)
                      ? " selected"
                      : "")
                  }
                  onclick={() =>
                    paymentList.updateMember(props.payment.id, member.id)
                  }
                >
                  {member.name}
                </div>
              )}
            </For>
          </div>
          <div class="button_list">
            <button
              onclick={() =>
                paymentList.selectAll(props.payment.id, memberList)
              }
            >
              전체선택
            </button>
            <button onclick={() => paymentList.unselectAll(props.payment.id)}>
              선택취소
            </button>
          </div>
        </Match>
        <Match when={props.selectedSection === 3}>
          <form class="label_input" onsubmit={changeMoney}>
            <input
              class="input_money"
              type="number"
              placeholder="0"
              required
              value={props.payment.money}
              ref={(ref) => (moneyRef = ref)}
              onKeyDown={(e) =>
                ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()
              }
              onchange={changeMoney}
            />
            원
          </form>
        </Match>
      </Switch>
    </div>
  );
}
