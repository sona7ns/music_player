
// 1 - render ra danh sách playlis











//================code javascrip===================
// define
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// khởi tạo biến lưu giá trị vào rom [key tìm: rom-1]
const PlAYER_STORAGE_KEY = "F8_PLAYER";

const cd = $('.cd');
const headingCurrentSong = $('.dashboard h2');
const thumbCurrentSong = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const timeLine = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $(".playlist");




// code chính
const app = {
    // flag
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,

    // [key tìm: rom-2]
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},

    // hàm để lưu giá trị cần nhớ vào rom [key tìm: rom-3]
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    // list bài hát
    songs: [
        {
            name: 'Cưới Thôi',
            singer: 'Masew x Masiu x B Ray x TAP',
            pathSong: './assets/music-playlist/music/1.mp3',
            pathThumb: './assets/music-playlist/thumb/1.jpg'
        },
        {
            name: 'Độ Tộc 2',
            singer: 'Masew; Pháo; Phúc Du; Độ Mixi',
            pathSong: './assets/music-playlist/music/2.mp3',
            pathThumb: './assets/music-playlist/thumb/2.jpg'
        },
        {
            name: 'Sài gòn hôm nay mưa',
            singer: 'Jsol & Hoàng Duyên',
            pathSong: './assets/music-playlist/music/3.mp3',
            pathThumb: './assets/music-playlist/thumb/3.jpg'
        },
        {
            name: 'Yêu Là Cưới',
            singer: 'Phát Hồ',
            pathSong: './assets/music-playlist/music/4.mp3',
            pathThumb: './assets/music-playlist/thumb/4.jpg'
        },
        {
            name: 'Phố đã lên đèn',
            singer: 'Huyền Tâm Môn',
            pathSong: './assets/music-playlist/music/5.mp3',
            pathThumb: './assets/music-playlist/thumb/5.jpg'
        },
        {
            name: 'Sắp 30',
            singer: 'Trịnh Đình Quang',
            pathSong: './assets/music-playlist/music/6.mp3',
            pathThumb: './assets/music-playlist/thumb/6.jpg'
        },
        {
            name: 'Tình Bạn Diệu Kỳ',
            singer: 'AMee; Ricky Star; Lăng LD',
            pathSong: './assets/music-playlist/music/7.mp3',
            pathThumb: './assets/music-playlist/thumb/7.jpg'
        },
        {
            name: 'Muộn Rồi Mà Sao Còn',
            singer: 'Sơn Tùng M-TP',
            pathSong: './assets/music-playlist/music/8.mp3',
            pathThumb: './assets/music-playlist/thumb/8.jpg'
        },
        {
            name: 'Phải Chăng Em Đã Yêu?',
            singer: 'Juky San; RedT',
            pathSong: './assets/music-playlist/music/9.mp3',
            pathThumb: './assets/music-playlist/thumb/9.jpg'
        },
        {
            name: 'Ôi bạn ơi :)',
            singer: 'TikTok',
            pathSong: './assets/music-playlist/music/10.mp3',
            pathThumb: './assets/music-playlist/thumb/10.jpg'
        }
    ],
    // thêm property object
    definePropertys: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    // tải ra giao diện playlist từ list bài hát songs
    renderPlaylist: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index='${index}'>
                <div class="thumb" style="background-image: url('${song.pathThumb}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        $('.playlist').innerHTML = htmls.join('');

    },
    // load bài hát đầu khi mở app
    loadCurentSong: function() {
        headingCurrentSong.textContent = this.currentSong.name;
        thumbCurrentSong.style.backgroundImage = `url('${this.currentSong.pathThumb}')`;
        audio.src = this.currentSong.pathSong;
    },
    // lắng nghe sự kiện
    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;
        // nếu cuộn chuột thì
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;
            cd.style.width = newcdWidth >= 0? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth / cdWidth;
        }

        // nếu bấm nút play thì phát nhạc và ...
        playBtn.onclick = function() {
            _this.isPlaying ? audio.pause() : audio.play();
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            //quay cdThumb
            rotateThumb.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            //dừng quay cdThumb
            rotateThumb.pause();
        }

        // update time len time line
        audio.ontimeupdate = function() {
            // audio.duration là tổng thời lượng 1 bài hát
            const timePercent = audio.currentTime * 100 / audio.duration;
            if (timePercent) {
                timeLine.value = timePercent;
            }
        }
        // update timeline khi tua
        timeLine.onchange = function(e) {
            audio.currentTime = audio.duration * e.target.value / 100;
        }

        // quay tron thumb khi play
        const rotateThumb = thumbCurrentSong.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // quay 10 seconds
            iterations: Infinity // quay không dừng
          });
        rotateThumb.pause();

        // chuyển bài khi bấm next
        nextBtn.onclick = function() {
            if(_this.isRandom) {
              _this.randomSong();
            } else {
                _this.nextSong();
            }
            _this.renderPlaylist();
            _this.scrollToActiveSong();
            audio.play();
        }

        // lùi bài khi bấm prev
        prevBtn.onclick = function() {
            _this.prevSong();
            _this.renderPlaylist();
            _this.scrollToActiveSong();
            audio.play();
        }

        // kết thúc bài hát thì next bài
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else if (_this.isRandom) {
                _this.randomSong();
                nextBtn.click();
            } else {
                nextBtn.click();
            }
        }

        // khi bấm nút random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom)
            // _this.isRepeat = !_this.isRepeat;
            // repeatBtn.classList.toggle('active', _this.isRepeat)
            //[key tìm: rom-4]
            _this.setConfig("isRandom", _this.isRandom);
        }

        // khi bấm nút repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat)
            // _this.isRandom = !_this.isRandom;
            // randomBtn.classList.toggle('active', _this.isRandom)
            //[key tìm: rom-5]
            _this.setConfig("isRepeat", _this.isRepeat);
        }  
        
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            //target.closest: kích vào thành phần nào thì e lấy phần đó vd kích thẻ i thì lấy thẻ i
            const songNode = e.target.closest(".song:not(.active)");
    
            if (songNode || e.target.closest(".option")) {
            // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurentSong();
                    _this.renderPlaylist();
                    audio.play();
                }
        
                // Xử lý khi click vào song option
                if (e.target.closest(".option")) {
                }
            }
        };


    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        // $('#song') == '1' ? $('#song').classList.add('active') : $('#song').classList.remove('active');

        this.loadCurentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurentSong();
    },

    randomSong: function() {
        var newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurentSong();

    },

    scrollToActiveSong: function () {
        setTimeout(() => {
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }, 300);
    },

    //[key tìm: rom-6]
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    start: function() {
        //[key tìm: rom-7 end]
        this.loadConfig();

        this.definePropertys();

        this.renderPlaylist();

        this.handleEvents();

        this.loadCurentSong();

        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
}

app.start();