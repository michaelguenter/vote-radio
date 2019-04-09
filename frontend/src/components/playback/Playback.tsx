import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../../store';
import { CurrentSong } from '../../store/playback/types';
import { loadCurrentSong, play, stop } from '../../store/playback/actions';
import Playbutton from './Playbutton';
import SongDescription from './songInfo/SongDescription';
import VotingInfo from './songInfo/VotingInfo';
import ProgressBar from './ProgressBar';
import CoverImage from './cover/CoverImage';
import CoverBackgroundImage from './cover/CoverBackgroundImage';
import AudioStream from './AudioStream';
import { apiBaseUrl, streamBaseUrl } from '../../config';
import './Playback.css';

interface PlaybackProps {
    currentSong: CurrentSong | null;
    playing: boolean;

    loadCurrentSong: () => void;
    play: () => void;
    stop: () => void;
}

interface PlaybackState {
    remainingDurationInSeconds: number;
}

class Playback extends Component<PlaybackProps, PlaybackState> {
    private interval?: number;

    constructor(props: PlaybackProps) {
        super(props);
        this.state = { remainingDurationInSeconds: 0 };
    }

    componentDidMount() {
        this.props.loadCurrentSong();
        this.interval = window.setInterval(() => this.updateRemainingDurationInSeconds(), 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    render() {
        // TODO: Propper loading indicator
        if (this.props.currentSong == null) {
            return (<div>Loading...</div>);
        }

        const streamUrl = streamBaseUrl + "/radio.mp3";
        const coverImageUrl = this.props.currentSong.coverImageId != null
            ? apiBaseUrl + "/api/image/getImageAsync?imageId=" + this.props.currentSong.coverImageId
            : null;

        return (
            <div className="playback-container">
                <CoverBackgroundImage url={coverImageUrl}>
                    <div className="playback">
                        <Playbutton 
                            playing={this.props.playing} 
                            onClick={() => this.togglePlayback()} 
                        />
                        
                        <SongDescription 
                            title={this.props.currentSong.title} 
                            album={this.props.currentSong.album} 
                            artist={this.props.currentSong.artist} 
                        />
                        <VotingInfo voteCount={this.props.currentSong.voteCount} />

                        <ProgressBar 
                            totalDurationInSeconds={this.props.currentSong.durationInSeconds}
                            remainingDurationInSeconds={this.state.remainingDurationInSeconds}
                        />

                        <CoverImage url={coverImageUrl} />
                    </div>
                </CoverBackgroundImage>
                <AudioStream 
                    src={streamUrl} 
                    title={this.props.currentSong.title} 
                    playing={this.props.playing}
                    onLoadingAbort={() => this.props.stop()}
                    onLoadingError={() => this.props.stop()}
                    onStreamEnded={() => this.props.stop()}
                />
            </div>
        );
    }

    private togglePlayback() {
        if (this.props.playing) {
            this.props.stop();
        }
        else {
            this.props.play();
        }
    }

    private updateRemainingDurationInSeconds() {
        if (this.props.currentSong != null) {
            const endsAtTime = new Date(this.props.currentSong.endsAtTime).getTime();
            const currentTime = new Date().getTime();

            const remainingDurationInSeconds = Math.max((endsAtTime - currentTime) / 1000, 0);
            this.setState({ remainingDurationInSeconds });
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    currentSong: state.playback.currentSong,
    playing: state.playback.playing
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadCurrentSong: () => dispatch<any>(loadCurrentSong()),
    play: () => dispatch(play()),
    stop: () => dispatch(stop())
});

export default connect(mapStateToProps, mapDispatchToProps)(Playback);