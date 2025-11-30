export type MustMatch<X, Y> = [X] extends [Y] ? ([Y] extends [X] ? X : never) : never;
