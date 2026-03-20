using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class FixNotificationIdTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Title = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Body = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsRead = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f8a2e1d0-1c5e-4b7e-9f3a-8c2d1b5e4f7a"),
                columns: new[] { "CreatedAtUTC", "Password", "UpdatedAtUTC" },
                values: new object[] { new DateTime(2026, 3, 20, 9, 21, 29, 980, DateTimeKind.Utc).AddTicks(6880), "$2a$11$jmvFqAjiMteaodrCiGd8zePzDR1WiBkNu9uZeIeAYkeiXezDjKM9m", new DateTime(2026, 3, 20, 9, 21, 29, 980, DateTimeKind.Utc).AddTicks(6880) });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f8a2e1d0-1c5e-4b7e-9f3a-8c2d1b5e4f7a"),
                columns: new[] { "CreatedAtUTC", "Password", "UpdatedAtUTC" },
                values: new object[] { new DateTime(2026, 3, 20, 5, 47, 19, 416, DateTimeKind.Utc).AddTicks(1270), "$2a$11$bCObecHDydlvp.nYy1FoZeAOADih1w5Cjusxl1kulsu/PIhI4ec5G", new DateTime(2026, 3, 20, 5, 47, 19, 416, DateTimeKind.Utc).AddTicks(1270) });
        }
    }
}
