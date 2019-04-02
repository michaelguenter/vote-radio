import { ThunkAction } from 'redux-thunk';

import { AppState } from '../index';
import { VotingCandidate, SET_VOTING_CANDIDATES, UPDATE_VOTE_COUNT, VotingActionTypes } from './types';
import { apiBaseUrl } from '../../config';

export function loadVotingCandidates(): ThunkAction<void, AppState, null, VotingActionTypes> {
    return async dispatch => {
        const response = await fetch(apiBaseUrl + "/api/voting/getVotingCandidatesAsync");
        const json = await response.json();

        dispatch(setVotingCandidates(json));
    };
}

export function setVotingCandidates(candidates: VotingCandidate[]): VotingActionTypes {
    return {
        type: SET_VOTING_CANDIDATES,
        payload: { candidates }
    };
}

export function updateVoteCount(vote: { songId: string}): VotingActionTypes {
    return {
        type: UPDATE_VOTE_COUNT,
        payload: vote
    };
}