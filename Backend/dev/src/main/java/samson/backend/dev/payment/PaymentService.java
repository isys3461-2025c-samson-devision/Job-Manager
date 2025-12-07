package samson.backend.dev.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
class PaymentService implements PaymentExternalInterface, PaymentInternalInterface {

    @Autowired
    private PaymentRepo PaymentRepo;
}
