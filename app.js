const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const play = $(".btn-pause");
const player = $(".player");
const progress = $(".progress");
const btnprev = $(".btn-left");
const btnnext = $(".btn-right");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist =  $(".playlist");


const app = {
  currentIndex: 0,
  isPlaying: false,
  isTimeUpdate: true,
  isRandom: false,
  isRepeat: false,

  songs: [
    {
      name: "Dead",
      singer: "Fliedkid",
      path: "./music/song1.mp3",
      image: "./img/1000-560.jpg",
    },
    {
      name: "Promblems",
      singer: "Fliedkid",
      path: "./music/song1.mp3",
      image: "./img/1440_1440.png",
    },
    {
      name: "Die",
      singer: "Fliedkid",
      path: "./music/song1.mp3",
      image: "./img/1000-560.jpg",
    },
    {
      name: "love",
      singer: "Fliedkid",
      path: "./music/song1.mp3",
      image: "./img/1000-560.jpg",
    },
    {
      name: "Gone",
      singer: "Fliedkid",
      path: "./music/song1.mp3",
      image: "./img/1000-560.jpg",
    },
    {
      name: "Sometime",
      singer: "Fliedkid",
      path: "./music/song1.mp3",
      image: "./img/1000-560.jpg",
    },
    {
      name: "beat it up",
      singer: "Fliedkid",
      path: "./music/song1.mp3",
      image: "./img/1000-560.jpg",
    },
  ],

  render: function () {
    let htmls = this.songs.map((song, index) => {
      return `
          
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                <div class="thumb"
                    style = "background-image : url('${song.image}')">
                </div>

                <div class="playlist-body">
                    <h3 class="title">${song.name}</h3>
                    <p class="artist">${song.singer}</p>
                </div>

                <div class="option">

                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });

    $(".playlist").innerHTML = htmls.join("\n");
  },

  // l???y ra gi?? tr???  c???a m???ng songs tr??? v??? b??i h??t hi???n t???i

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  // n?? l??m vi???c x??? l?? s??? ki???n x???y ra trong dom
  handelEvent: function () {
    const _this = this;
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    //  l???y ra cd v?? ????? d??i c???a CD th???c hi???n ???nh n???n cd gi???m d???n khi k??o xu???ng
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newcdWidth = cdWidth - scrollTop;

      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      // n???u gi?? tr??? newcdWidth l???n h??n ko th?? l???y gi?? tr??? ??c t??nh ra c??n kh??ng th?? l???y 0

      cd.style.opacity = newcdWidth / cdWidth;
    };

    // x??? l?? khi play
    play.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      // khi m?? ??ang playing b???ng false th?? b??i h??t s??? d???ng v?? ng?????c l???i
    };

      // khi b??i h??t ???????c ch???y
      audio.onplay = function () {
        player.classList.add("playing");
        _this.isPlaying = true;
        cdAnimate.play();
      };
      // khi b??i h??t b??? pause
      audio.onpause = function () {
        player.classList.remove("playing");
        _this.isPlaying = false;
        cdAnimate.pause();
      };
    

    // th???i gian b??i h??t
    audio.ontimeupdate = function () {
      // do gi?? tr??? ?????u ti??n l?? Nan n??n ph???i check c??i tr?????c
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // x??? l?? khi tua b??i h??t
    progress.onchange = function (e) {
      if (progress.onclick) {
        isTimeUpdate = false;
      } else isTimeUpdate = true;

      const switchTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = switchTime;
    };

    // x??? l?? CD quay v?? d???ng
    const cdAnimate = cdThumb.animate(
      [
        { transform: "rotate(360deg)" },
        // xoay360 ?????
      ],
      {
        duration: 10000,
        iterations: Infinity,
        // xoay trong 10s v?? quay v?? h???n
      }
    );
    cdAnimate.pause();

    // x??? l?? khi chuy???n b??i h??t
    btnnext.onclick = function () {
      //   _this.nextSong()
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollActiveSong();
    };
    btnprev.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollActiveSong();
    };

    // x??? l?? next song khi audio h???t
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnnext.click();
      }
    };

    // khi random song ta c?? khi b???t n??t random r???i click next hay prev th?? ms k??ch ho???t ??c ch??? ????? random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // x??? l?? repeat song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // click song l?? ch???y
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // X??? l?? khi click v??o song
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // X??? l?? khi click v??o song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },

  scrollActiveSong: function () {
    const activesong = $(".song.active");
    setTimeout(() => {
      activesong.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  },

  // chuy???n ti???p b??i h??t
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  // h??m random t???o 1 gi?? tr??? m???i b???ng s??? ng???u nhi??n nh??n v???i ????? d??i c???a m???ng v?? n???u
  //  gi?? tr??? m???i kh??ng ???????c b???ng gi?? tr??? hi???n t???i th?? currennt index tr??? v??? gi?? tr??? m???i
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
      console.log(newIndex);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  // t???i b??i h??t hi???n t???i
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  start: function () {
    // render playlist
    this.render();

    this.defineProperties();
    // ?????nh ngh??a c??c thu???c t??nh c???a object

    this.loadCurrentSong();

    this.handelEvent();
  },
};
app.start();
