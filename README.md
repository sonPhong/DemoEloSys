# MatchSys - Hệ thống theo dõi trận đấu và Elo của người chơi

## Mô tả
**MatchSys** hệ thống quản lý trận đấu giữa các người chơi, theo dõi Elo, tỷ lệ thắng/thua, chuỗi thắng/thua. Sử dụng thuật toán Elo để tính toán và cập nhật điểm Elo của người chơi sau mỗi trận đấu.

**Input** đầu vào là 100 người chơi, mỗi người có 100 trận đấu, kiểm tra ràng buộc đầu vào 100 người cùng tạo trận 1 lúc chỉ có 10 cặp đấu ==> tổng trận khởi chạy chỉ có 1000 trận
**Output** giao diện thống kê chi tiết người chơi, trận đấu, chỉ số elo, win-lose,...

## Các lớp chính trong hệ thống

1. **Player**: Lớp người chơi, chứa thông tin như tên, điểm Elo, chuỗi thắng/thua, và lịch sử các trận đấu.
2. **Match**: Lớp trận đấu. Tính toán người thắng và cập nhật các thông tin trận đấu cho Player.
3. **Stats**: Lớp cập nhật thông tin thống kê của người chơi sau mỗi trận đấu.
4. **SysElo**: Lớp sử dụng thuật toán Elo, tính toán và cập nhật điểm Elo cho các đội sau mỗi trận đấu.
5. **Rank**: Lớp tạo phân Rank

## Giới thiệu về thuật toán Elo

Thuật toán Elo là một hệ thống tính toán điểm cho các trò chơi đối kháng, nơi điểm số của người chơi thay đổi sau mỗi trận đấu dựa trên kết quả của trận đấu và sự chênh lệch Elo giữa hai người chơi.

- **K** là hệ số điều chỉnh, được mặc định là 32 trong hệ thống này.
- **Streak Bonus**: Nếu người chơi có chuỗi thắng lớn hơn hoặc bằng 5 trận, họ sẽ nhận được bonus Elo (tăng thêm 10%). Nếu họ có chuỗi thua lớn hơn hoặc bằng 5 trận, họ sẽ bị giảm 10% Elo.

- **thuật toán elo** tính trung bình tổng elo team return ra, sau đó áp dụng công thức tính điểm kì vọng, áp dụng công thức tính elo tổng cuối cùng kèm điều kiện tăng - giảm hệ số theo chuỗi thắng thua sau đó cập nhật elo cho Player.

- **công thức tính elo tổng** New Elo = Old Elo + K × (S − E) * bonus. K == hệ số động thường là 32, S == thức tế (win = 1, lose = 0), E == điểm kì vọng trận

- **công thức tính kì vọng** E = 1 / (1 + 10 ** ((elo đối thủ - elo người chơi) / 400));

### Menu
Khi ứng dụng được chạy hiện menu:

1. **🏆 Xem bảng xếp hạng**: Hiển thị top 10 người chơi với điểm Elo cao nhất.
2. **🔍 Xem lịch sử người chơi**: Xem lịch sử các trận đấu của một người chơi cụ thể, bao gồm kết quả thắng/thua, chuỗi thắng/thua và điểm Elo.
3. **🧮 Xem người chơi theo Rank**: Xem listPlayer theo rank
4. **➕ Thêm trận đấu**: Tạo thêm một số trận đấu mới giữa các người chơi.
5. **➕ Thêm người chơi**: Thêm người chơi mới vào hệ thống.
6. **🔄 Reset hệ thống**: Đặt lại hệ thống về trạng thái ban đầu, xóa tất cả người chơi và trận đấu hiện tại.
7. **❌ Thoát**: Thoát khỏi hệ thống.

### Các hàm chính

- **`createPlayer(nPlayer)`**: Tạo ra `nPlayer` người chơi mới với tham số động.
- **`createMatch(nMatch)`**: Tạo ra `nMatch` trận đấu mới với tham số động.
- **`showLeaderboard()`**: Hiển thị bảng xếp hạng của các người chơi theo điểm Elo.
- **`showPlayerHistory(playerId)`**: Hiển thị lịch sử các trận đấu của người chơi với `playerId`.
- **`showPlayersByRank()`**: Hiển thị mức rank và listPlayer trong rank đó.

### Lưu ý

- Mỗi trận đấu được tạo ngẫu nhiên và điểm Elo của người chơi sẽ được cập nhật sau mỗi trận.
- Khi khởi tạo, tạo ra 100 người chơi với thông tin chỉ có (id, name, status, elo) còn lại rỗng, update khi tạo trận thực tế
- Điểm Elo được tính toán dựa trên kết quả trận đấu và chuỗi thắng/thua của người chơi.
- Số lượng trận đấu và người chơi có thể được điều chỉnh dễ dàng qua các tùy chọn trong menu.

---

### Improve
- kỹ thuật code tệ (70% AI support) (logic chưa hoàn thiện, syntax và lên hệ thống == code chậm, luồng đi tạm ổn có hướng đi và phát triển nhưng chưa đủ khả năng control code khi triển khai)
- UX/UI: chưa có, tạo menu trực tiếp tại console
- Match: chưa có tạo đội = xáo trộn listPlayer tăng tính công bằng ==> bắt cặp mặc định 
- Stats: cần mở rộng đầy đủ chi tiết hơn
- EloSys: đang sử dụng hệ thống tính điểm dựa trên 2 điều kiện chính (trung bình cộng đội, chuỗi thắng-thua), có thể mở rộng thêm các điều kiện tăng-giảm hệ số