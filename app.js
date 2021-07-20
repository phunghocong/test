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

  // lấy ra giá trị  của mảng songs trả về bài hát hiện tại

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  // nó làm việc xử lý sự kiện xảy ra trong dom
  handelEvent: function () {
    const _this = this;
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    //  lấy ra cd và độ dài của CD thực hiện ảnh nền cd giảm dần khi kéo xuống
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newcdWidth = cdWidth - scrollTop;

      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      // nếu giá trị newcdWidth lớn hơn ko thì lấy giá trị đc tính ra còn không thì lấy 0

      cd.style.opacity = newcdWidth / cdWidth;
    };

    // xử lý khi play
    play.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      // khi mà đang playing bằng false thì bài hát sẽ dừng và ngược lại
    };

      // khi bài hát được chạy
      audio.onplay = function () {
        player.classList.add("playing");
        _this.isPlaying = true;
        cdAnimate.play();
      };
      // khi bài hát bị pause
      audio.onpause = function () {
        player.classList.remove("playing");
        _this.isPlaying = false;
        cdAnimate.pause();
      };
    

    // thời gian bài hát
    audio.ontimeupdate = function () {
      // do giá trị đầu tiên là Nan nên phải check cái trước
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // xử lý khi tua bài hát
    progress.onchange = function (e) {
      if (progress.onclick) {
        isTimeUpdate = false;
      } else isTimeUpdate = true;

      const switchTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = switchTime;
    };

    // xử lý CD quay và dừng
    const cdAnimate = cdThumb.animate(
      [
        { transform: "rotate(360deg)" },
        // xoay360 độ
      ],
      {
        duration: 10000,
        iterations: Infinity,
        // xoay trong 10s và quay vô hạn
      }
    );
    cdAnimate.pause();

    // xử lý khi chuyển bài hát
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

    // xử lý next song khi audio hết
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnnext.click();
      }
    };

    // khi random song ta có khi bật nút random rồi click next hay prev thì ms kích hoạt đc chế độ random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // xử lý repeat song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // click song là chạy
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vào song option
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

  // chuyển tiếp bài hát
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

  // hàm random tạo 1 giá trị mới bằng số ngẫu nhiên nhân với độ dài của mảng và nếu
  //  giá trị mới không được bằng giá trị hiện tại thì currennt index trả về giá trị mới
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
      console.log(newIndex);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  // tải bài hát hiện tại
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  start: function () {
    // render playlist
    this.render();

    this.defineProperties();
    // định nghĩa các thuộc tính của object

    this.loadCurrentSong();

    this.handelEvent();
  },
};
app.start();
