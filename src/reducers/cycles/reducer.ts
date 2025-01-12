import { produce } from 'immer'

import { ActionTypes } from "./actions";

export interface Cycle {
    id: string;
    task: string;
    minuteAmount: number;
    startDate: Date;
    interruptDate?: Date;
    finishDate?: Date;
  }

interface CycleState {
    cycles: Cycle[]
    activeCycleId: string | null
  }

export function cyclesReducer (state: CycleState, action: any) {
    switch(action.type) {
      case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, draft => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })

      case ActionTypes.INTERRUPT_CURRENT_CYCLE:{
        const currentyCycleIndex = state.cycles.findIndex(cycle => {
          return cycle.id === state.activeCycleId
        })

        if (currentyCycleIndex < 0 ) {
          return state
        }

        return produce(state, draft => {
          draft.activeCycleId = null
          draft.cycles[currentyCycleIndex].interruptDate = new Date()
        })
      }

      case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
        {
          const currentyCycleIndex = state.cycles.findIndex(cycle => {
            return cycle.id === state.activeCycleId
          })
  
          if (currentyCycleIndex < 0 ) {
            return state
          }
  
          return produce(state, draft => {
            draft.activeCycleId = null
            draft.cycles[currentyCycleIndex].finishDate = new Date()
          })
        }
      default:
        return state
    }
}