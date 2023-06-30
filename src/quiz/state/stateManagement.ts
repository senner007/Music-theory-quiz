class StateManager<TIdentifier extends string, TState extends Record<string, unknown>> {
    private stateMap: Map<TIdentifier, TState> = new Map();

    setState(target: TIdentifier, payload : TState): void {
        this.stateMap.set(target, payload);
    }

    getState(target: TIdentifier): TState {
        const state = this.fetchState(target);
        if (!state) {
            throw new Error();
        }
        return state;
    }

    stateIsSet(target: TIdentifier) : boolean {
        return this.fetchState(target) ? true : false; 
    }
 
    private fetchState(target: TIdentifier): TState | undefined {
        let state = this.stateMap.get(target);
        return state;
    }
}

const tempoStateManager = new StateManager<string, { tempo : number }>();

export { tempoStateManager as stateManager }