using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Task01.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionToBill : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Bills",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Bills",
                columns: new[] { "id", "Description", "UserId", "amount", "challanNumber", "dueDate", "status" },
                values: new object[,]
                {
                    { 1, "Electricity Bill", 33, 500m, "CHLN1001", new DateTime(2025, 8, 15, 0, 0, 0, 0, DateTimeKind.Local), "Pending" },
                    { 2, "Water Bill", 33, 750m, "CHLN1002", new DateTime(2025, 8, 20, 0, 0, 0, 0, DateTimeKind.Local), "Pending" },
                    { 3, "Gas Bill", 34, 1200m, "CHLN1003", new DateTime(2025, 8, 25, 0, 0, 0, 0, DateTimeKind.Local), "Pending" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Bills",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Bills",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Bills",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Bills");
        }
    }
}
