import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { TokenService } from 'src/app/services/token.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  tickets: any[] = [];
  showPdfTemplateId: string | null = null;

  constructor(
    private bookingService: BookingService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const customerId = this.tokenService.getUserId();
    if (!customerId) return;

    this.bookingService.getMyTickets(customerId).subscribe(res => {
      const tickets = res.data ?? res;
      this.tickets = tickets.map((ticket: any) => ({
        ...ticket,
        movieTitle: ticket.movieTitle || ticket.movieName // fallback if needed
      }));
    });
  }

  getSeatLabels(seatNos: number[]): string {
    if (!seatNos || seatNos.length === 0) {
      return 'N/A';
    }
    return seatNos.map(this.getSeatLabel).join(', ');
  }

  private getSeatLabel(seatNumber: number): string {
    const seatsPerRow = 10;
    const zeroBasedSeatNumber = seatNumber - 1;
    const rowIndex = Math.floor(zeroBasedSeatNumber / seatsPerRow);
    const seatIndexInRow = zeroBasedSeatNumber % seatsPerRow;
    const rowLabel = String.fromCharCode(65 + rowIndex);
    return `${rowLabel}${seatIndexInRow + 1}`;
  }

  cancelTicket(ticketId: string): void {
    if (confirm('Are you sure you want to cancel this ticket?')) {
      this.bookingService.cancelTicket(ticketId).subscribe(() => {
        alert('Ticket cancelled');
        this.loadBookings();
      });
    }
  }

  async downloadTicketPDF(ticket: any) {
    this.showPdfTemplateId = ticket.ticketId;
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for Angular to render

    const elementId = 'ticket-content-' + ticket.ticketId;
    const data = document.getElementById(elementId);

    if (!data) {
      alert('Ticket content not found!');
      this.showPdfTemplateId = null;
      return;
    }

    html2canvas(data, {
      backgroundColor: '#ffffff',
      scale: 2
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket-${ticket.movieTitle}-${ticket.showDate}.pdf`);
      this.showPdfTemplateId = null;
    }).catch(err => {
      alert('Failed to generate PDF: ' + err.message);
      this.showPdfTemplateId = null;
    });
  }
}