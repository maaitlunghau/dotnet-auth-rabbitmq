using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAtUTC", "Email", "Name", "Password", "Role", "Status", "UpdatedAtUTC", "VerificationCode", "VerificationCodeExpiresAt" },
                values: new object[] { new Guid("f8a2e1d0-1c5e-4b7e-9f3a-8c2d1b5e4f7a"), new DateTime(2026, 3, 20, 5, 47, 19, 416, DateTimeKind.Utc).AddTicks(1270), "trunghau@mstsoftware.vn", "Mai Trung Hau", "$2a$11$bCObecHDydlvp.nYy1FoZeAOADih1w5Cjusxl1kulsu/PIhI4ec5G", "admin", 1, new DateTime(2026, 3, 20, 5, 47, 19, 416, DateTimeKind.Utc).AddTicks(1270), null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f8a2e1d0-1c5e-4b7e-9f3a-8c2d1b5e4f7a"));
        }
    }
}
