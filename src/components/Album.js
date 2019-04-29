import React, { Component } from "react";
import albumData from "./../data/albums";
import PlayerBar from "./PlayerBar";

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find(album => {
      return album.slug === this.props.match.params.slug;
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      hoverSong: null
    };

    this.audioElement = document.createElement("audio");
    this.audioElement.src = album.songs[0].audioSrc;
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener(
      "timeupdate",
      this.eventListeners.timeupdate
    );
    this.audioElement.addEventListener(
      "durationchange",
      this.eventListeners.durationchange
    );
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener(
      "timeupdate",
      this.eventListeners.timeupdate
    );
    this.audioElement.removeEventListener(
      "durationchange",
      this.eventListeners.durationchange
    );
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song);
      }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(
      song => this.state.currentSong === song
    );
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  // modeled after handlePrevClick with changes in nextIndex using Mathmin method to return lowest index value of either next song or end of song index
  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(
      song => this.state.currentSong === song
    );
    const nextIndex = Math.min(
      currentIndex + 1,
      this.state.album.songs.length - 1
    );
    const nextSong = this.state.album.songs[nextIndex];
    this.setSong(nextSong);
    this.play();
  }

  // function to show play and/or pause button in place of song# when hovering over song
  hoverPlayPauseButton(song, index) {
    if (
      this.state.isPlaying &&
      this.state.currentSong === song &&
      this.state.hoverSong !== song
    ) {
      return <span className="ion-md-pause" />;
    } else if (
      this.state.hoverSong === song &&
      this.state.currentSong !== song
    ) {
      return <span className="ion-md-play" />;
    } else if (
      this.state.hoverSong === song &&
      this.state.currentSong === song &&
      this.state.isPlaying
    ) {
      return <span className="ion-md-pause" />;
    } else if (
      this.state.hoverSong === song &&
      this.state.currentSong === song &&
      !this.state.isPlaying
    ) {
      return <span className="ion-md-play" />;
    } else if (
      this.state.hoverSong !== song &&
      this.state.currentSong === song &&
      !this.state.isPlaying
    ) {
      return <span className="ion-md-play" />;
    } else {
      return index + 1;
    }
  }

  handleHover(song) {
    this.setState({ hoverSong: song });
  }

  removeHover() {
    this.setState({ hoverSong: null });
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img
            id="album-cover-art"
            src={this.state.album.albumCover}
            alt={this.state.album.title}
          />
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            {this.state.album.songs.map((song, index) => (
              <tr
                className="song"
                key={index}
                onClick={() => this.handleSongClick(song)}
                onMouseEnter={() => this.handleHover(song)}
                onMouseLeave={() => this.removeHover()}
              >
                <td>{this.hoverPlayPauseButton(song, index)}</td>
                <td>{song.title}</td>
                <td>{song.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={e => this.handleTimeChange(e)}
        />
      </section>
    );
  }
}
export default Album;
