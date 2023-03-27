import {createSignal, Signal} from "@spryker-oryx/utilities";
import {Observable} from "rxjs";

export function signalFrom<T>(observable$: Observable<T>): Signal<T | undefined> {
    const signal = createSignal<T | undefined>(undefined);
    observable$.subscribe((value) => signal.set(value));
    return signal;
}
