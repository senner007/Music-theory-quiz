class StateManager<T extends string> {
    private stateMap: Map<T, { tempo: number }> = new Map();

    setTempo(target: T, tempo: number): void {
        let state = this.getState(target);
        if (!state) {
            state = { tempo: tempo }; // Set the default tempo here
            this.stateMap.set(target, state);
        }
        state.tempo = tempo;
    }

    getTempo(target: T): number {
        const state = this.getState(target);
        if (!state) {
            throw new Error();
        }
        return state.tempo;
    }

    stateIsSet(target: T) : boolean {
        return this.getState(target) ? true : false; 
    }
 
    private getState(target: T): { tempo: number } | undefined {
        let state = this.stateMap.get(target);
        return state;
    }
}

const stateManager = new StateManager();

export { stateManager }