import React, { Component } from "react";
import albumData from "./../data/albums";

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find(album => {
      return album.slug === this.props.match.params.slug;
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false
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

  // function to show play and/or pause button in place of song# when hovering over song
  hoverPlayPauseButton(song) {    
    if (this.state.album.currentSong.isPlaying === this.state.hoveredSong) {
      return <span className="ion-pause" />;
    } else if  (this.state.hoveredSong)
      return <span className="ion-play" />;
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
              >
                <td>
                  {/* trying out different ways to arrange methods, states, and variables, and it's a mess, I know. I think you mean the map function from above on line 80 works in this data row since it's a child of tr? I also don't know what to do with hoverPlayPauseButton. */}
                  this.state.mouseLeave = {hoveredSong: null} mouseLeave = onMouseLeave {() => {
                    index + 1;
                  } 
                  mouseEnter = onMouseEnter{() => this.state = {song: hoveredSong} this.hoverPlayPauseButton(song, index)}
                </td>

                <td>{song.title}</td>
                <td>{song.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}
export default Album;
