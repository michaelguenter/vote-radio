import React, { Component } from 'react';

import { VotingCandidate } from '../../store/voting/types';
import SongDescription from '../songInfo/SongDescription';
import VotingInfo from '../songInfo/VotingInfo';
import CoverImage from '../songInfo/CoverImage';
import { apiBaseUrl } from '../../config';

interface CandidateProps {
    candidate: VotingCandidate;
    selected: boolean;

    onClick: () => void;
}

interface CandidateState {
    voteCountChange: number;
}

class Candidate extends Component<CandidateProps, CandidateState> {
    private changeIndicatorTimeout?: number;

    constructor(props: CandidateProps) {
        super(props);
        this.state = { voteCountChange: 0 };
    }

    componentDidUpdate(prevProps: CandidateProps) {
        if (this.props.candidate.voteCount != prevProps.candidate.voteCount) {
            window.clearTimeout(this.changeIndicatorTimeout);

            const voteCountChange = this.state.voteCountChange + (this.props.candidate.voteCount - prevProps.candidate.voteCount);
            this.setState({ voteCountChange });

            this.changeIndicatorTimeout = window.setTimeout(() => this.setState({ voteCountChange: 0 }), 2000);
        }
    }

    render() {
        const isDisabled = !this.props.candidate.isActive;
        const className = "voting-candidate" 
            + (isDisabled ? " disabled" : "") 
            + (this.props.selected ? " selected" : "");

        const coverImageUrl = this.props.candidate.coverImageId != null
            ? apiBaseUrl + "/api/image/getImageAsync?imageId=" + this.props.candidate.coverImageId
            : null;

        return (
            <div className={className} role="button" tabIndex={isDisabled ? -1 : 0} aria-disabled={isDisabled}
                 onClick={() => this.onClick()}
                 onKeyPress={e => this.onKeyPress(e)}>
                <VotingInfo voteCount={this.props.candidate.voteCount} voteCountChange={this.state.voteCountChange} />
                <CoverImage url={coverImageUrl} />
                <SongDescription 
                    title={this.props.candidate.title} 
                    album={this.props.candidate.album} 
                    artist={this.props.candidate.artist} 
                />
            </div>
        );
    }

    private onClick() {
        if (this.props.candidate.isActive) {
            this.props.onClick();
        }
    }

    private onKeyPress(e: React.KeyboardEvent) {
        const keyCode = e.which || e.keyCode;

        // Enter or Spacebar
        if (keyCode == 13 || keyCode == 32) {
            this.onClick();
        }
    }
}

export default Candidate;