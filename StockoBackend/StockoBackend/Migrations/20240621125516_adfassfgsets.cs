using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockoBackend.Migrations
{
    public partial class adfassfgsets : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionDetails_TransactionHeaders_TransactionHeaderTransactionID",
                table: "TransactionDetails");

            migrationBuilder.DropIndex(
                name: "IX_TransactionDetails_TransactionHeaderTransactionID",
                table: "TransactionDetails");

            migrationBuilder.DropColumn(
                name: "TransactionHeaderTransactionID",
                table: "TransactionDetails");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionDetails_TransactionID",
                table: "TransactionDetails",
                column: "TransactionID");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionDetails_TransactionHeaders_TransactionID",
                table: "TransactionDetails",
                column: "TransactionID",
                principalTable: "TransactionHeaders",
                principalColumn: "TransactionID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionDetails_TransactionHeaders_TransactionID",
                table: "TransactionDetails");

            migrationBuilder.DropIndex(
                name: "IX_TransactionDetails_TransactionID",
                table: "TransactionDetails");

            migrationBuilder.AddColumn<int>(
                name: "TransactionHeaderTransactionID",
                table: "TransactionDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TransactionDetails_TransactionHeaderTransactionID",
                table: "TransactionDetails",
                column: "TransactionHeaderTransactionID");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionDetails_TransactionHeaders_TransactionHeaderTransactionID",
                table: "TransactionDetails",
                column: "TransactionHeaderTransactionID",
                principalTable: "TransactionHeaders",
                principalColumn: "TransactionID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
