package controllers

import (
	"crypto/tls"
	"fmt"
	"net/smtp"

	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
)

func GetSystemSettings(c *fiber.Ctx) error {
	var settings []models.SystemSetting
	if err := config.DB.Find(&settings).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(settings)
}

func UpdateSystemSettings(c *fiber.Ctx) error {
	var input []models.SystemSetting
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	for _, s := range input {
		config.DB.Where("`key` = ?", s.Key).Assign(models.SystemSetting{
			Value: s.Value,
			Group: s.Group,
		}).FirstOrCreate(&models.SystemSetting{Key: s.Key})
	}

	return c.JSON(fiber.Map{"message": "Settings updated successfully"})
}
func SendTestEmail(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	type Req struct {
		To string `json:"to"`
	}
	var req Req
	c.BodyParser(&req)

	// Fetch user email
	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}

	recipient := req.To
	if recipient == "" {
		recipient = user.Email
	}

	// Fetch SMTP settings
	var settings []models.SystemSetting
	config.DB.Where("`group` = ?", "smtp").Find(&settings)

	smtpData := make(map[string]string)
	for _, s := range settings {
		smtpData[s.Key] = s.Value
	}

	host := smtpData["smtp_host"]
	port := smtpData["smtp_port"]
	userSmtp := smtpData["smtp_user"]
	pass := smtpData["smtp_pass"]

	if host == "" || port == "" || userSmtp == "" || pass == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Cấu hình SMTP chưa đầy đủ."})
	}

	// Email content
	subject := "Subject: UpMonitor Test Email\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	name := user.Email
	if user.FullName != nil {
		name = *user.FullName
	}
	body := fmt.Sprintf("<html><body><h2>UpMonitor Test Email</h2><p>Xin chào <b>%s</b>,</p><p>Đây là email kiểm tra từ hệ thống UpMonitor. Nếu bạn nhận được email này, cấu hình SMTP của bạn đã hoạt động chính xác!</p><p>Thời gian: %v</p></body></html>", name, fmt.Sprint(config.DB.NowFunc()))
	msg := []byte(subject + mime + body)

	addr := fmt.Sprintf("%s:%s", host, port)
	auth := smtp.PlainAuth("", userSmtp, pass, host)

	var err error
	if port == "465" {
		// Implicit TLS for port 465
		tlsConfig := &tls.Config{
			InsecureSkipVerify: true,
			ServerName:         host,
		}
		
		conn, errDial := tls.Dial("tcp", addr, tlsConfig)
		if errDial != nil {
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Lỗi kết nối SSL (465): %v", errDial)})
		}
		defer conn.Close()

		client, errSmtp := smtp.NewClient(conn, host)
		if errSmtp != nil {
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Lỗi khởi tạo SMTP: %v", errSmtp)})
		}
		defer client.Quit()

		if ok, _ := client.Extension("AUTH"); ok {
			if err = client.Auth(auth); err != nil {
				return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Lỗi xác thực: %v", err)})
			}
		}

		if err = client.Mail(userSmtp); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Lỗi lệnh MAIL FROM: %v", err)})
		}
		if err = client.Rcpt(recipient); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Lỗi lệnh RCPT TO: %v", err)})
		}

		w, errData := client.Data()
		if errData != nil {
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Lỗi lệnh DATA: %v", errData)})
		}
		_, err = w.Write(msg)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Lỗi ghi nội dung: %v", err)})
		}
		err = w.Close()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Lỗi đóng nội dung: %v", err)})
		}
	} else {
		// Standard smtp.SendMail for other ports (usually 587 with STARTTLS provided by SendMail internally)
		err = smtp.SendMail(addr, auth, userSmtp, []string{recipient}, msg)
	}

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Lỗi gửi email: %v", err)})
	}

	return c.JSON(fiber.Map{"message": "Email kiểm tra đã được gửi thành công đến " + recipient})
}
