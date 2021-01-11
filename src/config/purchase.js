import RNIap, {purchaseUpdatedListener} from 'react-native-iap';

export const purchased = async (productId1, productId2) => {
    let isPurchased = false;

    try {
        const purchases = await RNIap.getAvailablePurchases();

        purchases.forEach((purchase) =>{
            if(purchase.productId === productId1){
                isPurchased = true;
                return;
            } 

            if(purchase.productId === productId2){
                isPurchased = true;
                return;
            } 
        })

      return isPurchased;
    } catch (error) {
        return false;
    }
};

export const requestPurchase = async (productId) => {
    try {
        await RNIap.requestSubscription(productId)
        alert('Parabéns, você assinou o WeWo! Aproveite!')
    } catch (error) {
        console.log('Erro ao recuperar dados da assinatura, por favor, tente novamente: ' + error)
    }
};

export const fetchAvailableProducts = async (productsIds) => {
    try {
        const getProducts = await RNIap.getSubscriptions(productsIds)
    } catch (error) {
        console.log('ERRO AO OBTER PRODUTO: ' + error)
    }
};

export const purchaseUpdateSubscription = async () => {
    purchaseUpdatedListener(async (purchase) =>{
        const receipt = purchase.transactionReceipt;

        if(receipt) {
            const ackResult = await RNIap.finishTransaction(purchase);
        }
    });
};