package main

import (
	"log"

	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
)

func main() {
	// Kết nối Database
	config.ConnectDB()

	// 1. Seed Pricing Plans
	plans := []models.Plan{
		{
			Name:        "Cơ Bản",
			Price:       0,
			Currency:    "VND",
			Interval:    "monthly",
			Features:    "5 màn hình giám sát,Chu kỳ kiểm tra 5 phút,1 trang trạng thái,Thông báo qua Email",
			MaxMonitors: 5,
			IsDefault:   true,
		},
		{
			Name:        "Chuyên Nghiệp",
			Price:       240000,
			Currency:    "VND",
			Interval:    "monthly",
			Features:    "50 màn hình giám sát,Chu kỳ kiểm tra 1 phút,Tất cả kênh thông báo,Giám sát SSL",
			MaxMonitors: 50,
			IsDefault:   false,
		},
		{
			Name:        "Doanh Nghiệp",
			Price:       820000,
			Currency:    "VND",
			Interval:    "monthly",
			Features:    "250 màn hình giám sát,Chu kỳ kiểm tra 30 giây,Báo cáo SLA,Hỗ trợ Team",
			MaxMonitors: 250,
			IsDefault:   false,
		},
	}

	for _, p := range plans {
		var existing models.Plan
		if err := config.DB.Where("name = ?", p.Name).First(&existing).Error; err != nil {
			// Not found, create
			if err := config.DB.Create(&p).Error; err != nil {
				log.Printf("Failed to create plan %s: %v", p.Name, err)
			} else {
				log.Printf("Created plan: %s", p.Name)
			}
		} else {
			// Update
			config.DB.Model(&existing).Updates(p)
			log.Printf("Updated plan: %s", p.Name)
		}
	}

	// 2. Seed Articles
	articles := []models.Article{
		{
			Title:       "Hướng Dẫn Giám Sát Uptime Hiệu Quả Cho Doanh Nghiệp Của Bạn",
			Slug:        "huong-dan-giam-sat-uptime-hieu-qua",
			Summary:     "Khám phá các phương pháp tốt nhất để duy trì thời gian hoạt động 99.99% cho ứng dụng web của bạn, từ cấu hình cảnh báo đến phân tích nguyên nhân gốc rễ.",
			Content:     "Trong thế giới số hóa hiện nay, việc duy trì một website luôn hoạt động (uptime) là yếu tố sống còn đối với bất kỳ doanh nghiệp nào. Khách hàng mong đợi các dịch vụ trực tuyến không bao giờ gián đoạn.\n\n### Tại sao Uptime quan trọng?\nMột phút downtime (thời gian chết) có thể dẫn đến thiệt hại doanh thu đáng kể, chưa kể đến sự suy giảm niềm tin từ phía khách hàng. Uptime không chỉ ảnh hưởng đến trải nghiệm người dùng mà còn là một yếu tố quan trọng trong SEO.\n\n### Cách thiết lập UpMonitor hiệu quả\n1. **Xác định các Endpoint quan trọng:** Đừng chỉ ping trang chủ. Hãy giám sát cả API, trang thanh toán, và cơ sở dữ liệu.\n2. **Tần suất kiểm tra:** Đối với các cổng thanh toán, hãy cài đặt tần suất 1 phút hoặc 30 giây.\n3. **Cấu hình đa kênh thông báo:** Kết hợp Email và Telegram để đảm bảo không bỏ lỡ cảnh báo nào, đặc biệt vào ban đêm.\n\nHãy nhớ rằng, giám sát không chỉ là biết khi nào hệ thống hỏng, mà là phát hiện sự suy giảm hiệu suất trước khi hệ thống ngừng hoạt động hoàn toàn.",
			Thumbnail:   "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
			Author:      "UpMonitor Team",
			Status:      "published",
			SEOTitle:    "Hướng Dẫn Giám Sát Uptime | UpMonitor Blog",
			SEOKeywords: "uptime, giám sát website, ping monitor, giảm downtime",
			SEODesc:     "Bí quyết tối ưu hóa thời gian hoạt động của website và cấu hình hệ thống cảnh báo sớm giúp doanh nghiệp vươn lên.",
		},
		{
			Title:       "UpMonitor Ra Mắt Tính Năng Giám Sát Database & Ping TCP",
			Slug:        "ra-mat-tinh-nang-giam-sat-database",
			Summary:     "Bản cập nhật lớn nhất mang đến khả năng giám sát trực tiếp vào cơ sở dữ liệu MySQL và kiểm tra các cổng TCP tùy chỉnh.",
			Content:     "Chúng tôi rất vui mừng thông báo bản cập nhật lớn nhất của nền tảng UpMonitor: **Giám Sát Cơ Sở Dữ Liệu & TCP Ping**.\n\nTrước đây, việc ứng dụng báo lỗi 500 nhưng trang chủ vẫn tải bình thường là một vấn đề đau đầu. Bây giờ, UpMonitor cho phép bạn:\n\n- **Ping trực tiếp MySQL:** Chúng tôi kết nối và thực hiện truy vấn `SELECT 1` để đảm bảo Database vẫn phản hồi nhanh chóng.\n- **Kiểm tra Port TCP:** Giám sát các dịch vụ nội bộ chưa được bóc tách ra HTTP (Redis, Memcached, custom sockets).\n\n### Trải nghiệm ngay hôm nay\nTất cả người dùng trên mọi nền tảng (kể cả Gói Cơ Bản) đều có thể truy cập các loại màn hình giám sát mới này. Đăng nhập ngay vào trang quản trị để thiết lập các lớp phòng thủ mới cho hạ tầng của bạn!",
			Thumbnail:   "https://images.unsplash.com/photo-1588602220140-57eb77bc034d?q=80&w=2000&auto=format&fit=crop",
			Author:      "Tech Lead",
			Status:      "published",
			SEOTitle:    "Tính Năng Mới: TCP & Database Monitor | UpMonitor",
			SEOKeywords: "mysql monitor, tcp ping, upmonitor update",
			SEODesc:     "Đọc chi tiết về bản nâng cấp quan trọng của UpMonitor giúp tăng khả năng bao phủ lên toàn bộ backend.",
		},
	}

	for _, a := range articles {
		var existing models.Article
		if err := config.DB.Where("slug = ?", a.Slug).First(&existing).Error; err != nil {
			if err := config.DB.Create(&a).Error; err != nil {
				log.Printf("Failed to create article %s: %v", a.Title, err)
			} else {
				log.Printf("Created article: %s", a.Title)
			}
		} else {
			config.DB.Model(&existing).Updates(a)
			log.Printf("Updated article: %s", a.Title)
		}
	}

	log.Println("Seeding completed successfully!")
}
